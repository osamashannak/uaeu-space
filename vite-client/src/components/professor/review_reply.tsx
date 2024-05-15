import styles from "../../styles/components/professor/review.module.scss";
import dayjs from "dayjs";
import {formatRelativeTime} from "../../utils.tsx";
import {ReviewReplyAPI} from "../../typed/professor.ts";
import ReplyCompose from "./reply_compose.tsx";
import {useState} from "react";


export default function ReviewReply({reply, reviewId}: { reply: ReviewReplyAPI, reviewId: number }) {

    const [replyCompose, showReplyCompose] = useState(false);



    return (
        <>
            <div className={styles.reply}>
                <div className={styles.replyAuthor}>
                    <span>{reply.author}</span>
                    <div className={"text-separator"}>
                        <span>·</span>
                    </div>
                    <time
                        dateTime={reply.created_at.toString()}
                        title={dayjs(reply.created_at).format("MMM D, YYYY h:mm A")}
                        className={styles.time}
                    >{formatRelativeTime(new Date(reply.created_at))}</time>
                    {reply.op && <>
                        <div className={"text-separator"}>
                            <span>·</span>
                        </div>
                        <span className={styles.authorText}>Author</span></>}
                </div>
                <div>
                    <p dir={"auto"} className={styles.replyText}>{reply.mention &&
                        <span className={styles.mention}>@{reply.mention} </span>}{reply.comment}</p>
                </div>
                <div className={styles.replyFooter}>
                    <div className={styles.replyButton}>
                        <span>Reply</span>
                    </div>
                    <div className={styles.likeButton}>
                        <svg className={styles.ratingIcon} xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 24 24">
                            <g>
                                <path fill="currentColor"
                                      d="m15 10l-.493-.082A.5.5 0 0 0 15 10.5V10ZM4 10v-.5a.5.5 0 0 0-.5.5H4Zm16.522 2.392l.49.098l-.49-.098ZM6 20.5h11.36v-1H6v1Zm12.56-11H15v1h3.56v-1Zm-3.067.582l.806-4.835l-.986-.165l-.806 4.836l.986.164ZM14.82 3.5h-.213v1h.213v-1Zm-3.126 1.559L9.178 8.832l.832.555l2.515-3.774l-.832-.554ZM7.93 9.5H4v1h3.93v-1ZM3.5 10v8h1v-8h-1Zm16.312 8.49l1.2-6l-.98-.196l-1.2 6l.98.196ZM9.178 8.832A1.5 1.5 0 0 1 7.93 9.5v1a2.5 2.5 0 0 0 2.08-1.113l-.832-.555Zm7.121-3.585A1.5 1.5 0 0 0 14.82 3.5v1a.5.5 0 0 1 .494.582l.986.165ZM18.56 10.5a1.5 1.5 0 0 1 1.471 1.794l.98.196a2.5 2.5 0 0 0-2.45-2.99v1Zm-1.2 10a2.5 2.5 0 0 0 2.452-2.01l-.98-.196A1.5 1.5 0 0 1 17.36 19.5v1Zm-2.754-17a3.5 3.5 0 0 0-2.913 1.559l.832.554a2.5 2.5 0 0 1 2.08-1.113v-1ZM6 19.5A1.5 1.5 0 0 1 4.5 18h-1A2.5 2.5 0 0 0 6 20.5v-1Z"/>
                                <path stroke="currentColor" d="M8 10v10"/>
                            </g>
                        </svg>
                        <div className={styles.likeCount}>
                            <span>{reply.likes}</span>
                        </div>
                    </div>
                </div>
            </div>
            {replyCompose && <ReplyCompose id={reply.id} author={reply.author} comment={reply.comment} mention={reply.mention}
                                           created_at={reply.created_at} showReplyCompose={showReplyCompose} reviewId={reviewId}/>}
        </>
    )
}
