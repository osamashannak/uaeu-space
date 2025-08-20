import styles from "../../styles/components/professor/review.module.scss";
import ReviewReply from "./review_reply.tsx";
import {useContext, useState} from "react";
import {getReviewReplies} from "../../api/professor.ts";
import {CommentsContext} from "../../context/comments.ts";
import {useDispatch} from "react-redux";
import {changeRepliesCount} from "../../redux/slice/professor_slice.ts";


export default function ReplySection({reviewId, comments, op}: { reviewId: string, comments: number, op: boolean }) {

    const [loading, setLoading] = useState(false);
    const [moreLoading, setMoreLoading] = useState(false);

    const context = useContext(CommentsContext);

    const dispatch = useDispatch();

    const unloadedReplies = comments - context.comments.length;


    if (loading) {
        return (
            <div className={styles.viewMoreReply}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <rect width="24" height="24" fill="none"/>
                    <path fill="currentColor"
                          d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                          opacity="0.5"/>
                    <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
                        <animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite"
                                          to="360 12 12" type="rotate"/>
                    </path>
                </svg>
            </div>
        )
    }


    if (!context.comments.length) {
        return (
            <div className={styles.viewMoreReply} onClick={async () => {
                setLoading(true);
                const repliesAPI = await getReviewReplies(reviewId, []);
                context.setComments(repliesAPI?.replies || []);
                setLoading(false);
            }}>
                --- View {unloadedReplies} {unloadedReplies === 1 ? "reply" : "replies"}
            </div>
        )
    }


    return (
        <>
            <div className={styles.commentsSection}>
                <div className={styles.line}></div>
                <div className={styles.commentsList}>

                    {context.comments.map((reply, index) => {
                        return <ReviewReply reply={reply} key={index} reviewId={reviewId} op={op}/>
                    })}

                </div>
            </div>

            {unloadedReplies > 0 && (moreLoading ?
                <div className={styles.viewMoreReply}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <rect width="24" height="24" fill="none"/>
                        <path fill="currentColor"
                              d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                              opacity="0.5"/>
                        <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
                            <animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite"
                                              to="360 12 12" type="rotate"/>
                        </path>
                    </svg>
                </div>
                : <div className={styles.viewMoreReply} onClick={async () => {
                    setMoreLoading(true);

                    const ids = context.comments.map((reply) => reply.id);

                    const repliesAPI = await getReviewReplies(reviewId, ids);

                    const newReplies = repliesAPI?.replies.filter((reply) => !context.comments.find((existingReply) => existingReply.id === reply.id));

                    context.setComments([...context.comments, ...(newReplies || [])]);

                    if (repliesAPI?.comments) {
                        dispatch(changeRepliesCount({reviewId, count: repliesAPI.comments}));
                    }

                    setMoreLoading(false);
                }}>
                    <span>View more replies...</span>
                </div>)}
        </>
    )


}
