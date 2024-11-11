import {Request, Response} from 'express';
import {Professor} from "@spaceread/database/entity/professor/Professor";
import {Review} from "@spaceread/database/entity/professor/Review";
import requestIp from "request-ip";
import {createAssessment, generateUsername, isUAEUIp, validateProfessorComment, validateReply} from "../utils";
import {ReviewAttachment} from "@spaceread/database/entity/professor/ReviewAttachment";
import {ReviewRating} from "@spaceread/database/entity/professor/ReviewRating";
import {ReviewReply} from "@spaceread/database/entity/professor/ReviewReply";
import {GuestReplyName} from "@spaceread/database/entity/professor/GuestReplyName";
import {ReplyLike} from "@spaceread/database/entity/professor/ReplyLike";
import {RatingBody} from "../typed/professor";
import {AppDataSource, Azure} from "../app";
import {AzureClient} from "../azure";
import {Guest} from "@spaceread/database/entity/user/Guest";
import * as crypto from "crypto";
import sizeOf from 'image-size';

const cache = new Map<string, any[]>();
const scoreCache = new Map<string, number>();

export const deleteComment = async (req: Request, res: Response) => {
    const reviewId = parseInt(<string>req.query.id);

    const guest: Guest = res.locals.user;

    if (!reviewId) {
        res.status(400).json();
        return;
    }

    let review = await AppDataSource.getRepository(Review).findOne({
        where: {id: reviewId, guest: {token: guest.token}}
    });

    if (!review) {
        res.status(404).json();
        return;
    }

    review.soft_delete = true;

    await AppDataSource.getRepository(Review).save(review);

    res.status(200).json({success: true, message: null});
}

export const comment = async (req: Request, res: Response) => {
    const body = validateProfessorComment(req.body);

    const guestID: Guest = res.locals.user;

    let address = requestIp.getClientIp(req);

    if (!body || !guestID || !address) {
        res.status(400).json({
            success: false,
            message: "There was an error submitting your review. Contact us if the problem persists."
        });
        return;
    }

    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    const valid = await createAssessment(body.recaptchaToken);

    const professorDB = await AppDataSource.getRepository(Professor).findOne({
        where: {email: body.professorEmail},
        relations: ["reviews", "reviews.guest"]
    });

    if (!professorDB) {
        res.status(400).json({
            success: false,
            message: "There was an error submitting your review. Contact us if the problem persists."
        });
        return;
    }

    const existingReview = professorDB.reviews.find(review => review.guest && (review.guest.token === guestID.token) && !review.soft_delete);

    if (existingReview) {
        res.status(400).json({
            success: false,
            message: "You have already submitted a review for this professor."
        });
        return;
    }

    const review = new Review();

    if (body.attachments && body.attachments.length > 0) {
        review.attachments = [];
        for (const attachment of body.attachments) {
            const reviewAttachment = await AppDataSource.getRepository(ReviewAttachment).findOne({
                where: {id: attachment}
            });

            if (reviewAttachment && reviewAttachment.visible) {
                review.attachments.push(attachment);
            }
        }
    }

    review.comment = body.comment || "";
    review.score = body.score;
    review.positive = body.positive;
    review.professor = professorDB;
    review.author_ip = address;
    review.guest = guestID;
    review.visible = valid;

    await AppDataSource.getRepository(Review).save(review);

    const {author_ip, visible, reviewed, professor, guest, ..._} = review;

    res.status(201).json({success: true, review: _});
}

export const uploadImage = async (req: Request, res: Response) => {
    const file = req.file;
    let address = requestIp.getClientIp(req);

    if (!file) {
        res.status(400).json({error: "Invalid."});
        return;
    }

    if (!address) {
        res.status(400).json({error: "Invalid."});
        return;
    }

    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    const dimensions = sizeOf(file.buffer);

    const blobName = crypto.randomUUID();

    res.status(200).json({result: "success", id: blobName});

    await Azure.uploadAttachment(blobName, file.buffer, file.mimetype);

    const reviewAttachment = new ReviewAttachment();

    reviewAttachment.id = blobName;
    reviewAttachment.mime_type = file.mimetype;
    reviewAttachment.size = file.size;
    reviewAttachment.height = dimensions.height!;
    reviewAttachment.width = dimensions.width!;
    reviewAttachment.ip_address = address;

    await AppDataSource.getRepository(ReviewAttachment).save(reviewAttachment);

    reviewAttachment.visible = await Azure.analyzeImage(AzureClient.getFileURL(blobName, "attachments"));

    await AppDataSource.getRepository(ReviewAttachment).save(reviewAttachment);
}

export const uploadTenor = async (req: Request, res: Response) => {
    const body = req.body as {
        url: string;
        height: number;
        width: number;
    };

    if (!body.url || !body.url.startsWith("https://media.tenor.com/") || !body.height || !body.width) {
        res.status(400).json({error: "Invalid."});
        return;
    }

    res.status(200).json({result: "success", id: body.url});

    const existing = await AppDataSource.getRepository(ReviewAttachment).findOne({
        where: {id: body.url}
    });

    if (existing) {
        return;
    }

    const reviewAttachment = new ReviewAttachment();

    reviewAttachment.mime_type = "image/gif";
    reviewAttachment.id = body.url;
    reviewAttachment.height = body.height;
    reviewAttachment.width = body.width;
    reviewAttachment.visible = true;

    await AppDataSource.getRepository(ReviewAttachment).save(reviewAttachment);

}

export const find = async (req: Request, res: Response) => {

    const params = req.query;

    if (!params.email) {
        res.status(400).json({"request": "failed"});
        return;
    }

    const email = (params.email as string).toLowerCase();

    const professor = await AppDataSource.getRepository(Professor).findOne({
        where: {email, visible: true},
        relations: ["reviews", "reviews.ratings", "reviews.guest", "reviews.replies", "reviews.ratings.guest"],
        order: {reviews: {created_at: "desc"}},
        select: ["name", "email", "college", "university"]
    });

    if (!professor) {
        res.status(404).json({error: "Professor not found."});
        return;
    }

    await AppDataSource.getRepository(Professor).increment({email: professor.email}, "views", 1);

    const guestId: Guest = res.locals.user;

    const selfReview = guestId && professor.reviews.find(review => review.guest && (review.guest.token === guestId.token) && !review.soft_delete)?.id;

    const filteredReviews = professor.reviews.filter(review => (review.visible || review.id === selfReview) && !review.soft_delete);

    const canReview = guestId && selfReview === undefined && !guestId.rated_professors.includes(professor.email);

    let professorsRatedBySameGuests = cache.get(email);

    const reviewsGuestToken = professor.reviews.map(review => review.guest?.token).filter(Boolean);

    if (!professorsRatedBySameGuests && reviewsGuestToken.length > 0) {

        const university = professor.university;

        professorsRatedBySameGuests = await AppDataSource.getRepository(Professor)
            .createQueryBuilder("professor")
            .leftJoin("professor.reviews", "review")
            .leftJoin("review.guest", "guest")
            .where("guest.token IN (:...reviewsGuestToken)", { reviewsGuestToken })
            .andWhere("professor.email != :email", { email })
            .andWhere("professor.university = :university", { university })
            .andWhere("professor.visible")
            .andWhere("review.visible")
            .groupBy("professor.email")
            .select([
                "professor.email",
                "professor.name",
                "professor.college"
            ])
            .orderBy("COUNT(DISTINCT guest.token)", "DESC")
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

        cache.set(email, professorsRatedBySameGuests);

    }

    const newProfessor = {
        ...professor,
        similarlyRated: professorsRatedBySameGuests || [],
        canReview: canReview,
        reviews: await Promise.all(
            filteredReviews
                .map(async ({guest, ratings, reviewed, author_ip, visible, replies, attachments, ...review}) => {
                    const likesCount = ratings.filter(rating => rating.value).length;
                    const dislikesCount = ratings.filter(rating => !rating.value).length;

                    let attachment = null;

                    if (attachments && attachments.length > 0) {
                        attachment = await Promise.all(
                            attachments.map(async attachment => {

                                const reviewAttachment = await AppDataSource.getRepository(ReviewAttachment).findOne({
                                    where: {id: attachment}
                                });

                                if (reviewAttachment && reviewAttachment.visible) {
                                    if (reviewAttachment.id.includes("tenor")) {
                                        return {
                                            id: attachment,
                                            height: reviewAttachment.height,
                                            width: reviewAttachment.width,
                                            url: reviewAttachment.id,
                                        };
                                    }

                                    return {
                                        id: attachment,
                                        height: reviewAttachment.height,
                                        width: reviewAttachment.width,
                                        url: AzureClient.getFileURL(attachment, "attachments"),
                                    };
                                }
                            })
                        );
                    }

                    let selfRating = null;

                    if (guestId) {
                        const rating = ratings.find(rating => rating.guest?.token === guestId.token);
                        if (rating) {
                            selfRating = rating.value;
                        }
                    }

                    return {
                        ...review,
                        author: "User",
                        likes: likesCount,
                        dislikes: dislikesCount,
                        comments: replies.filter(reply => !reply.soft_delete).length,
                        attachments: attachment,
                        self: review.id === selfReview,
                        selfRating: selfRating,
                        hidden: !visible && review.id === selfReview || undefined,
                        uaeuOrigin: isUAEUIp(author_ip)
                    };
                })),
        score: filteredReviews.reduce((sum, review) => sum + review.score, 0) / Math.max(filteredReviews.length, 1)
    };

    newProfessor.reviews.sort((a, b) => {
        const aDate = new Date(a.created_at).getTime();
        const bDate = new Date(b.created_at).getTime();
        const aLikes = a.likes - a.dislikes;
        const bLikes = b.likes - b.dislikes;

        const oneWeek = 7 * 24 * 60 * 60 * 1000; // milliseconds in one week
        const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000; // milliseconds in six months
        const now = Date.now();

        // Check if a review is less than a week old
        const aNew = now - aDate < oneWeek;
        const bNew = now - bDate < oneWeek;

        // Check if a review is older than 6 months
        const aOld = now - aDate > sixMonths;
        const bOld = now - bDate > sixMonths;

        // If both reviews are less than a week old, sort by date
        if (aNew && bNew) {
            return bDate - aDate;
        }

        // If one review is new and the other is not, the new one comes first
        if (aNew !== bNew) {
            return aNew ? -1 : 1;
        }

        // If one review is old and the other is not, the old one goes to the bottom
        if (aOld !== bOld) {
            return aOld ? 1 : -1;
        }

        // If both reviews are not new and not old, sort by score of 1 and 5
        if (a.score === 1 || a.score === 5) {
            if (b.score === 1 || b.score === 5) {
                // If both have score of 1 or 5, sort by likes/dislikes ratio
                if (aLikes !== bLikes) {
                    return bLikes - aLikes;
                } else {
                    // If likes/dislikes ratio is the same, sort by date
                    return bDate - aDate;
                }
            } else {
                // If only a has score of 1 or 5, a comes first
                return -1;
            }
        } else if (b.score === 1 || b.score === 5) {
            // If only b has score of 1 or 5, b comes first
            return 1;
        } else {
            // If neither has score of 1 or 5, sort by likes/dislikes ratio
            if (aLikes !== bLikes) {
                return bLikes - aLikes;
            } else {
                // If likes/dislikes ratio is the same, sort by date
                return bDate - aDate;
            }
        }
    });


    res.status(200).json({success: true, professor: newProfessor});
}

export const getAll = async (req: Request, res: Response) => {

    const university = req.query.university as string ?? "United Arab Emirates University";

    const professors = await AppDataSource.getRepository(Professor).find({
        where: {visible: true, university: university},
        select: {name: true, email: true}
    });

    res.status(200).json({professors: professors});
}

export const addRating = async (req: Request, res: Response) => {
    const body = req.body as RatingBody;

    const guest: Guest = res.locals.user;

    let address = requestIp.getClientIp(req);

    if (!body.reviewId || body.positive === null || !guest || !address) {
        res.status(400).json();
        return;
    }

    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    let rating: ReviewRating;

    const review = await AppDataSource.getRepository(Review).findOne({
        where: {id: body.reviewId}
    });

    const existingRating = await AppDataSource.getRepository(ReviewRating).findOne({
        where: {guest: {token: guest.token}, review: {id: body.reviewId}}
    });

    if (!review || existingRating) {
        res.status(404).json();
        return;
    }

    rating = new ReviewRating();

    rating.guest = guest;
    rating.review = review;
    rating.value = body.positive;
    rating.ip_address = address;
    rating.id = crypto.randomUUID();

    await AppDataSource.getRepository(ReviewRating).save(rating);

    res.status(200).json({result: "success"});
}

export const removeRating = async (req: Request, res: Response) => {
    const reviewId = parseInt(<string>req.query.reviewId);

    const guest: Guest = res.locals.user;

    if (!guest || !reviewId) {
        res.status(400).json();
        return;
    }

    let rating = await AppDataSource.getRepository(ReviewRating).findOne({
        where: {review: {id: reviewId}, guest: {token: guest.token}}
    });

    if (!rating) {
        res.status(404).json();
        return;
    }

    await AppDataSource.getRepository(ReviewRating).remove(rating);

    res.status(200).json({result: "success"});
}

export const postReply = async (req: Request, res: Response) => {
    const body = validateReply(req.body);

    const guestID: Guest = res.locals.user;

    if (!body || !guestID) {
        res.status(400).json({
            success: false,
            message: "There was an error submitting your review. Contact us if the problem persists."
        });
        return;
    }

    const reviewDb = await AppDataSource.getRepository(Review).findOne({
        where: {id: body.reviewId}
    });

    if (!reviewDb) {
        res.status(400).json({
            success: false,
            message: "There was an error submitting your review. Contact us if the problem persists."
        });
        return;
    }

    const reviewReply = new ReviewReply();

    reviewReply.comment = body.comment;
    reviewReply.review = reviewDb;
    reviewReply.guest = guestID;

    if (body.replyId) {

        const replyDb = await AppDataSource.getRepository(ReviewReply).findOne({
            where: {id: body.replyId},
            relations: ["review", "guest"]
        });

        if (!replyDb || replyDb.review.id !== body.reviewId) {
            res.status(400).json({
                success: false,
                message: "There was an error submitting your review. Contact us if the problem persists."
            });
            return;
        }

        reviewReply.mention = replyDb;

    }

    await AppDataSource.getRepository(ReviewReply).save(reviewReply);

    const authorReplyNameDB = await AppDataSource.getRepository(GuestReplyName).findOne({
        where: {guest: {token: guestID.token}, review: {id: body.reviewId}}
    });

    let authorReplyName;

    if (authorReplyNameDB) {
        authorReplyName = authorReplyNameDB.name;
    }

    const {visible, guest, review, mention, ..._} = reviewReply;

    let mentionedName;

    if (mention) {
        const mentionGuest = await AppDataSource.getRepository(GuestReplyName).findOne({
            where: {guest: {token: mention.guest.token}, review: {id: body.reviewId}}
        });

        if (mentionGuest) {
            mentionedName = mentionGuest.name;
        }
    }


    res.status(201).json({
        success: true, reply: {
            id: _.id,
            comment: _.comment,
            created_at: _.created_at,
            author: authorReplyName,
            mention: mentionedName
        }
    });
}

export const deleteReply = async (req: Request, res: Response) => {
    const replyId = parseInt(<string>req.query.id);

    const guest: Guest = res.locals.user;

    if (!guest || !replyId) {
        res.status(400).json({success: false, message: "Invalid."});
        return;
    }

    let reply = await AppDataSource.getRepository(ReviewReply).findOne({
        where: {id: replyId, guest: {token: guest.token}}
    });

    if (!reply) {
        res.status(404).json({success: false, message: "Invalid."});
        return;
    }

    reply.soft_delete = true;

    await AppDataSource.getRepository(ReviewReply).save(reply);

    res.status(200).json({success: true, message: null});
}


export const getReplies = async (req: Request, res: Response) => {
    const reviewId = parseInt(<string>req.query.id);
    const current = (<string>req.query.current).split(",").map(id => parseInt(id));

    if (!reviewId) {
        res.status(400).json();
        return;
    }

    const reviewDB = await AppDataSource.getRepository(Review).findOne({
        where: {id: reviewId, replies: {soft_delete: false}},
        relations: ["guest", "replies", "replies.guest", "replies.mention", "replies.mention.guest", "replies.likes", "replies.likes.guest"],
        order: {created_at: "asc"}
    });

    if (!reviewDB) {
        res.status(404).json();
        return;
    }

    const replyNameCache = new Map<string, string>();

    const guestId: Guest = res.locals.user;

    let replies = reviewDB.replies;

    replies = replies.filter(reply => !current.includes(reply.id));

    replies.sort((a, b) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    replies = replies.slice(0, 5);

    const newReplies = await Promise.all(
        replies.map(async ({guest, replies, visible, review, mention, likes, ...reply}) => {
            let authorReplyName;

            if (replyNameCache.has(guest.token)) {
                authorReplyName = replyNameCache.get(guest.token);
            } else {
                const authorReplyNameDB = await AppDataSource.getRepository(GuestReplyName).findOne({
                    where: {guest: {token: guest.token}, review: {id: reviewId}}
                });

                if (authorReplyNameDB) {
                    authorReplyName = authorReplyNameDB.name;
                    replyNameCache.set(guest.token, authorReplyName);
                }
            }

            let mentionedName;

            if (mention) {

                if (replyNameCache.has(mention.guest.token)) {
                    mentionedName = replyNameCache.get(mention.guest.token);
                } else {
                    const mentionGuest = await AppDataSource.getRepository(GuestReplyName).findOne({
                        where: {guest: {token: mention.guest.token}, review: {id: reviewId}}
                    });

                    if (mentionGuest) {
                        mentionedName = mentionGuest.name;
                        replyNameCache.set(mention.guest.token, mentionGuest.name);
                    }
                }
            }

            return {
                ...reply,
                mention: mentionedName,
                author: authorReplyName,
                likes: likes.length,
                op: guest.token === reviewDB.guest?.token,
                self: guestId.token === guest.token,
                selfLike: likes.some(like => like.guest.token === guestId.token),
            }
        }));

    res.status(200).json({replies: newReplies, comments: reviewDB.replies.length});
}


export const likeReply = async (req: Request, res: Response) => {
    const replyId = parseInt(<string>req.query.id);

    const guest: Guest = res.locals.user;

    if (!replyId) {
        res.status(400).json();
        return;
    }

    const reply = await AppDataSource.getRepository(ReviewReply).findOne({
        where: {id: replyId}
    });

    if (!reply) {
        res.status(404).json();
        return;
    }

    const existingRating = await AppDataSource.getRepository(ReplyLike).findOne({
        where: {guest: {token: guest.token}, reply: {id: replyId}}
    });

    if (existingRating) {
        res.status(400).json();
        return;
    }

    const like = new ReplyLike();

    like.guest = guest;
    like.reply = reply;

    await AppDataSource.getRepository(ReplyLike).save(like);

    res.status(200).json({success: true});

}

export const removeLikeReply = async (req: Request, res: Response) => {
    const replyId = parseInt(<string>req.query.id);

    const guest: Guest = res.locals.user;

    if (!replyId) {
        res.status(400).json();
        return;
    }

    const like = await AppDataSource.getRepository(ReplyLike).findOne({
        where: {reply: {id: replyId}, guest: {token: guest.token}}
    });

    if (!like) {
        res.status(404).json();
        return;
    }

    await AppDataSource.getRepository(ReplyLike).remove(like);

    res.status(200).json({success: true});

}

export const getReplyName = async (req: Request, res: Response) => {
    const reviewId = parseInt(<string>req.query.id);

    const guest: Guest = res.locals.user;
    if (!reviewId) {
        res.status(400).json();
        return;
    }

    let replyName = await AppDataSource.getRepository(GuestReplyName).findOne({
        where: {review: {id: reviewId}, guest: {token: guest.token}}
    });

    if (!replyName) {
        const review = await AppDataSource.getRepository(Review).findOne({
            where: {id: reviewId}
        });

        if (!review) {
            res.status(404).json();
            return;
        }

        let generatedName;

        while (!generatedName) {
            const name = generateUsername();

            const existingName = await AppDataSource.getRepository(GuestReplyName).findOne({
                where: {name: name, review: {id: reviewId}}
            });

            if (!existingName) {
                generatedName = name;
            }
        }

        replyName = new GuestReplyName();

        replyName.guest = guest;
        replyName.review = review;
        replyName.name = generatedName;

        await AppDataSource.getRepository(GuestReplyName).save(replyName);

    }

    res.status(200).json({name: replyName?.name});

}