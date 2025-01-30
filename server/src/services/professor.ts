import {AppDataSource, Azure} from "../app";
import {Professor} from "@spaceread/database/entity/professor/Professor";
import {ReviewAttachment} from "@spaceread/database/entity/professor/ReviewAttachment";
import {Review} from "@spaceread/database/entity/professor/Review";
import {ReviewRating} from "@spaceread/database/entity/professor/ReviewRating";
import {Guest} from "@spaceread/database/entity/user/Guest";
import {PostReview} from "../typed/professor";
import {AzureClient} from "./azure";
import sizeOf from "image-size";
import crypto from "crypto";

export class ProfessorService {

    private repository;
    private reviewAttachmentRepository;
    private reviewRepository;
    private reviewRatingRepository;

    constructor() {
        this.repository = AppDataSource.getRepository(Professor);
        this.reviewAttachmentRepository = AppDataSource.getRepository(ReviewAttachment);
        this.reviewRepository = AppDataSource.getRepository(Review);
        this.reviewRatingRepository = AppDataSource.getRepository(ReviewRating);

    }


    async getProfessors(university: string) {
        return await this.repository.find({
            where: {visible: true, university},
            select: {name: true, email: true}
        });
    }

    async getProfessor(email: string) {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const professor = await this.repository.findOne({
            where: {
                email,
                visible: true
            },
            relations: ["reviews", "reviews.ratings", "reviews.actor", "reviews.replies", "reviews.ratings.actor"],
            order: {reviews: {created_at: "desc"}},
            select: ["name", "email", "college", "university"]
        });

        if (professor) {
            await this.repository.increment({email: email}, "views", 1);
        }

        return professor;
    }

    async getReview(reviewId: number) {
        return await this.reviewRepository.findOne({
            where: {id: reviewId}
        });
    }

    async postReview(review: PostReview) {
        const r = new Review();

        r.actor = review.guest;
        r.professor = review.professor;
        r.author_ip = review.ipAddress;
        r.comment = review.comment;
        r.score = review.score;
        r.positive = review.positive;
        r.attachments = await this.validateAttachments(review.attachments);

        await this.reviewRepository.save(r);

        return r;
    }

    async deleteReview(reviewId: number, guestToken: string) {
        const review = await this.reviewRepository.findOne({
            where: {id: reviewId, actor: {token: guestToken}},
        });

        if (!review) {
            throw new Error("The review doesn't exist.");
        }

        review.soft_delete = true;

        await this.reviewRepository.save(review);
    }

    private async validateAttachments(attachments: string[]) {
        const validAttachments: string[] = [];
        for (const attachment of attachments) {
            const reviewAttachment = await this.reviewAttachmentRepository.findOne({
                where: {id: attachment},
            });
            if (reviewAttachment && reviewAttachment.visible) {
                validAttachments.push(attachment);
            }
        }
        return validAttachments;
    }

    async fetchAttachments(attachmentIds: string[]) {
        const attachments = [];

        for (const id of attachmentIds) {
            const attachment = await this.reviewAttachmentRepository.findOne({
                where: {id, visible: true},
            });

            if (attachment) {
                attachments.push({
                    id,
                    height: attachment.height,
                    width: attachment.width,
                    url: attachment.id.includes("tenor")
                        ? attachment.id
                        : AzureClient.getFileURL(id, "attachments"),
                });
            }
        }

        return attachments;
    }

    async fetchSimilarProfessors(professor: Professor, guestTokens: (string | undefined)[]) {
        if (!guestTokens.length) return [];

        let professorsRatedBySameGuests = await this.repository
            .createQueryBuilder("professor")
            .leftJoin("professor.reviews", "review")
            .leftJoin("review.actor", "actor")
            .where("actor.token IN (:...guestTokens)", {guestTokens})
            .andWhere("professor.email != :email", {email: professor.email})
            .andWhere("professor.university = :university", {university: professor.university})
            .andWhere("professor.visible")
            .andWhere("review.visible")
            .groupBy("professor.email")
            .select([
                "professor.email",
                "professor.name",
                "professor.college"
            ])
            .orderBy("COUNT(DISTINCT actor.token)", "DESC")
            .limit(3)
            .getRawMany();

        for (let i = 0; i < professorsRatedBySameGuests.length; i++) {
            const relatedProf = professorsRatedBySameGuests[i];

            const profReviews = await AppDataSource.getRepository(Review)
                .createQueryBuilder("review")
                .where("review.professorEmail = :professorEmail", { professorEmail: relatedProf.professor_email })
                .andWhere("review.visible = true")
                .andWhere("review.soft_delete = false")
                .getMany();

            relatedProf.reviewCount = profReviews.length;

            relatedProf.score = profReviews.reduce((sum, review) => sum + review.score, 0) / Math.max(profReviews.length, 1);

            const highlyRatedReview = await AppDataSource.getRepository(Review)
                .createQueryBuilder("review")
                .leftJoin("review.ratings", "rating")
                .where("review.professorEmail = :professorEmail", { professorEmail: relatedProf.professor_email })
                .groupBy("review.id")
                .andWhere("review.visible = true")
                .andWhere("review.soft_delete = false")
                .orderBy("SUM(CASE WHEN rating.value THEN 1 ELSE 0 END) - SUM(CASE WHEN rating.value = false THEN 1 ELSE 0 END)", "DESC") // Like-dislike ratio
                .addOrderBy("LENGTH(review.comment)", "DESC") // Prefer longer reviews
                .getOne();

            if (!highlyRatedReview) {
                professorsRatedBySameGuests.splice(i, 1);
                i--;
                continue;
            }

            relatedProf.review = highlyRatedReview ? highlyRatedReview.comment : "";
        }

        return professorsRatedBySameGuests;
    }

    async uploadImageToAzure(file: Express.Multer.File, address: string) {
        const dimensions = sizeOf(file.buffer);
        const blobName = crypto.randomUUID();

        await Azure.uploadAttachment(blobName, file.buffer, file.mimetype);

        const reviewAttachment = new ReviewAttachment();
        reviewAttachment.id = blobName;
        reviewAttachment.mime_type = file.mimetype;
        reviewAttachment.size = file.size;
        reviewAttachment.height = dimensions.height!;
        reviewAttachment.width = dimensions.width!;
        reviewAttachment.ip_address = address;

        reviewAttachment.visible = await Azure.analyzeImage(
            AzureClient.getFileURL(blobName, "attachments")
        );

        await this.reviewAttachmentRepository.save(reviewAttachment);

        return blobName;
    }

    async uploadTenorToAzure(url: string, width: number, height: number) {
        const existing = await this.reviewAttachmentRepository.findOne({
            where: {id: url}
        });

        if (existing) {
            return;
        }

        const reviewAttachment = new ReviewAttachment();

        reviewAttachment.mime_type = "image/gif";
        reviewAttachment.id = url;
        reviewAttachment.height = height;
        reviewAttachment.width = width;
        reviewAttachment.visible = true;

        await this.reviewAttachmentRepository.save(reviewAttachment);

    }

    async getRating(guestToken: string, reviewId: number) {
        return await this.reviewRatingRepository.findOne({
            where: {actor: {token: guestToken}, review: {id: reviewId}}
        });
    }

    async addRating(guest: Guest, review: Review, ipAddress: string, positive: boolean) {
        const rating = new ReviewRating();

        rating.actor = guest;
        rating.review = review;
        rating.value = positive;
        rating.ip_address = ipAddress;
        rating.id = crypto.randomUUID();

        await this.reviewRatingRepository.save(rating);
    }

    async deleteRating(rating: ReviewRating) {
        await this.reviewRatingRepository.remove(rating);
    }


}