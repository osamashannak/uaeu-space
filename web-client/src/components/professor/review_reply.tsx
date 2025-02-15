import styles from "../../styles/components/professor/review.module.scss";
import dayjs from "dayjs";
import {formatRelativeTime} from "../../utils.tsx";
import {ReviewReplyAPI} from "../../typed/professor.ts";
import ReplyCompose from "./reply_compose.tsx";
import {useContext, useState} from "react";
import ReplyLike from "./reply_like.tsx";
import {CommentsContext} from "../../context/comments.ts";
import {deleteReply} from "../../api/professor.ts";
import {useDispatch} from "react-redux";
import {removeReply} from "../../redux/slice/professor_slice.ts";


export default function ReviewReply({reply, reviewId, op}: { reply: ReviewReplyAPI, reviewId: number, op: boolean }) {

    const [replyCompose, showReplyCompose] = useState(false);
    const [aspectRatio, setAspectRatio] = useState(1);
    const context = useContext(CommentsContext);

    const dispatch = useDispatch();

    async function deleteReplyPressed() {

        const response = await deleteReply(reply.id);

        if (!response || !response.success) return;

        context.setComments(context.comments.filter((r) => r.id !== reply.id));
        dispatch(removeReply({reviewId}));
    }

    if (reply.gif) {
        const img = new Image();
        img.onload = () => {
            setAspectRatio(img.height / img.width);
            console.log(aspectRatio);
        }
        img.src = reply.gif;
    }

    return (
        <>
            <div className={`${styles.reply}  ${reply.fadeIn ? styles.fadeIn : ''}`}>
                <div className={styles.replyAuthor}>
                    <span>{reply.author}{reply.self && " (You)"}</span>
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
                {reply.gif ?
                    <div className={styles.replyAttachment}>
                        <div style={{paddingBottom: `${(aspectRatio) * 100}%`}}></div>
                        <div style={{backgroundImage: `url(${reply.gif})`}}
                             className={styles.imageDiv}>
                        </div>
                        <img src={reply.gif}
                             draggable={false}
                             width={100}
                             height={100}
                             alt={""}/>
                    </div>
                    : <div>
                        <p dir={"auto"} className={styles.replyText}>{reply.mention &&
                            <span className={styles.mention}>@{reply.mention} </span>}{reply.comment}</p>
                    </div>}
                <div className={styles.replyFooter}>
                    <div className={styles.footerButtons}>
                        <div className={styles.replyButton} onClick={() => {
                            showReplyCompose(!replyCompose)
                        }}>
                            <span>Reply</span>
                        </div>
                        {
                            reply.self && <>
                                <div className={"text-separator"}>
                                    <span>·</span>
                                </div>
                                <div className={styles.replyButton} onClick={deleteReplyPressed}>
                                    <span>Delete</span>
                                </div>
                            </>
                        }
                    </div>
                    <ReplyLike id={reply.id} likes={reply.likes} self={reply.selfLike}/>
                </div>
            </div>
            {replyCompose &&
                <ReplyCompose id={reply.id} author={reply.author} comment={reply.comment} mention={reply.id}
                              created_at={reply.created_at} replyMention={reply.mention}
                              showReplyCompose={showReplyCompose} reviewId={reviewId}
                              op={op}/>}
        </>
    )
}
