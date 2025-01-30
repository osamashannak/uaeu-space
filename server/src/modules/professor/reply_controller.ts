import {Request, Response} from "express";
import {Guest} from "@spaceread/database/entity/user/Guest";
import {validateReply} from "../../utils/utils";
import {AppDataSource} from "../../app";
import {Review} from "@spaceread/database/entity/professor/Review";
import {ReviewReply} from "@spaceread/database/entity/professor/ReviewReply";
import {GuestReplyName} from "@spaceread/database/entity/professor/GuestReplyName";
import {generateUsername} from "../../utils/utils";
import {ReplyLike} from "@spaceread/database/entity/professor/ReplyLike";


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

    reviewReply.comment = body.content.comment;
    reviewReply.review = reviewDb;
    reviewReply.actor = guestID;
    if (body.content.gif) {
        reviewReply.gif = body.content.gif;
    }

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

    const {visible, actor, review, mention, ..._} = reviewReply;

    let mentionedName;

    if (mention) {
        const mentionGuest = await AppDataSource.getRepository(GuestReplyName).findOne({
            where: {guest: {token: mention.actor.token}, review: {id: body.reviewId}}
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
            gif: _.gif,
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
        where: {id: replyId, actor: {token: guest.token}}
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
        relations: ["actor", "replies", "replies.actor", "replies.mention", "replies.mention.actor", "replies.likes", "replies.likes.actor"],
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
        replies.map(async ({actor, replies, visible, review, mention, likes, ...reply}) => {
            let authorReplyName;

            if (replyNameCache.has(actor.token)) {
                authorReplyName = replyNameCache.get(actor.token);
            } else {
                const authorReplyNameDB = await AppDataSource.getRepository(GuestReplyName).findOne({
                    where: {guest: {token: actor.token}, review: {id: reviewId}}
                });

                if (authorReplyNameDB) {
                    authorReplyName = authorReplyNameDB.name;
                    replyNameCache.set(actor.token, authorReplyName);
                }
            }

            let mentionedName;

            if (mention) {

                if (replyNameCache.has(mention.actor.token)) {
                    mentionedName = replyNameCache.get(mention.actor.token);
                } else {
                    const mentionGuest = await AppDataSource.getRepository(GuestReplyName).findOne({
                        where: {guest: {token: mention.actor.token}, review: {id: reviewId}}
                    });

                    if (mentionGuest) {
                        mentionedName = mentionGuest.name;
                        replyNameCache.set(mention.actor.token, mentionGuest.name);
                    }
                }
            }

            return {
                ...reply,
                mention: mentionedName,
                author: authorReplyName,
                likes: likes.length,
                op: actor.token === reviewDB.actor?.token,
                self: guestId.token === actor.token,
                selfLike: likes.some(like => like.actor.token === guestId.token),
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
        where: {actor: {token: guest.token}, reply: {id: replyId}}
    });

    if (existingRating) {
        res.status(400).json();
        return;
    }

    const like = new ReplyLike();

    like.actor = guest;
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
        where: {reply: {id: replyId}, actor: {token: guest.token}}
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