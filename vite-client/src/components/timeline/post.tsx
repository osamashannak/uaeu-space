import dayjs from "dayjs";
import styles from "../../styles/components/timeline/post.module.scss";
import {formatRelativeTime, parseText} from "../../utils.tsx";
import {useEffect} from "react";
import {PostAPI} from "../../typed/timeline.ts";
import PostInteractions from "./post_interactions.tsx";
import {useNavigate} from "react-router-dom";


export default function Post(post: PostAPI) {

    const navigate = useNavigate();

    useEffect(() => {
        const p = document.getElementById(`post_comment_${post.id}`);

        if (!p) return;

        parseText(p);

    }, [post.id]);

    return (
        <div className={styles.postWrapper}>
            <article className={`${styles.post} ${post.fadeIn ? styles.fadeIn : ''}`}
                     onClick={() => {
                         if (window.getSelection()?.toString()) return;

                         navigate(`/post/${post.id}`)
                     }}>
                <div className={styles.postHead}>

                    <div className={styles.postInfo}>
                        <div className={styles.authorName}>{post.author}</div>
                        <div className={"text-separator"}>
                            <span>·</span>
                        </div>
                        <time
                            dateTime={post.created_at.toString()}
                            title={dayjs(post.created_at).format("MMM D, YYYY h:mm A")}
                            className={styles.time}
                        >{formatRelativeTime(new Date(post.created_at))}</time>
                    </div>
                    <div className={styles.postOptions} onClick={(e) => {
                        e.stopPropagation();

                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256">
                            <rect width="256" height="256" fill="none"/>
                            <path fill="currentColor"
                                  d="M144 128a16 16 0 1 1-16-16a16 16 0 0 1 16 16m-84-16a16 16 0 1 0 16 16a16 16 0 0 0-16-16m136 0a16 16 0 1 0 16 16a16 16 0 0 0-16-16"/>
                        </svg>
                    </div>

                </div>

                <div className={styles.postBody}>

                    <p dir={"auto"} id={`post_comment_${post.id}`}>
                        {post.comment.trim()}
                    </p>

                    <div className={styles.imageList}>
                        {
                            post.attachments && post.attachments.map((attachment, index) => (
                                <div key={index} className={styles.attachment} onClick={() => {
                                    window.open(attachment.url, "_blank");
                                }}>
                                    <div
                                        style={{paddingBottom: `${attachment.height / attachment.width * 100}%`}}></div>
                                    <div style={{backgroundImage: `url(${attachment.url})`}} className={styles.imageDiv}>
                                    </div>
                                    <img src={attachment.url}
                                         draggable={false}
                                         width={100}
                                         height={100}
                                         alt={""}/>
                                </div>)
                            )

                        }
                    </div>
                </div>


                <div className={styles.postFooter}>
                    <PostInteractions likes={post.likes} id={post.id}
                                      self={post.selfRating} comments={post.comments}/>


                </div>

            </article>

        </div>
    );
}