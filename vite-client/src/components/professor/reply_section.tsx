import styles from "../../styles/components/professor/review.module.scss";
import ReviewReply from "./review_reply.tsx";
import {useRef, useState} from "react";
import {ReviewReplyAPI} from "../../typed/professor.ts";
import {getReviewReplies} from "../../api/professor.ts";


export default function ReplySection({reviewId, comments}: { reviewId: number, comments: number }) {

    const [loading, setLoading] = useState(false);
    const [moreLoading, setMoreLoading] = useState(false);
    const [replies, setReplies] = useState<ReviewReplyAPI[]>([]);

    const commentsLength = useRef(comments);

    const unloadedReplies = commentsLength.current - replies.length;

    if (loading) {
        return (
            <div className={styles.viewMoreButton}>
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


    if (!replies.length) {
        return (
            <div className={styles.viewMoreButton} onClick={async () => {
                setLoading(true);
                const repliesAPI = await getReviewReplies(reviewId);
                setReplies(repliesAPI?.replies || []);
            }}>
                View {unloadedReplies} {unloadedReplies === 1 ? "reply" : "replies"}
            </div>
        )
    }


    return (
        <>
            <div className={styles.commentsSection}>
                <div className={styles.line}></div>
                <div className={styles.commentsList}>

                    {replies.map((reply, index) => {
                        return <ReviewReply reply={reply} key={index} reviewId={reviewId}/>
                    })}

                </div>
            </div>

            {unloadedReplies > 0 && (moreLoading ?
                <div className={styles.viewMoreButton}>
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
                : <div className={styles.viewMoreButton} onClick={async () => {
                    setMoreLoading(true);
                    setMoreLoading(false);
                    const repliesAPI = await getReviewReplies(reviewId, replies.length);
                    setReplies([...replies, ...(repliesAPI?.replies || [])]);
                    if (repliesAPI?.comments) {
                        commentsLength.current = repliesAPI.comments;
                    }
                }}>
                    <span>View more replies...</span>
                </div>)}
        </>
    )


}
