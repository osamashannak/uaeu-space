import {useParams} from "react-router-dom";
import styles from "../styles/pages/post.module.scss";
import postStyles from "../styles/components/timeline/post.module.scss";
import dayjs from "dayjs";
import {formatRelativeTime} from "../utils.tsx";
import PostInteractions from "../components/timeline/post_interactions.tsx";
import {PostAPI} from "../typed/timeline.ts";
import ReplyField from "../components/timeline/reply_field.tsx";

export default function Post() {
    const {id} = useParams();

    const post: PostAPI = {
        id: 1,
        author: "SomeRandomName",
        comment: "How can I register for this class?",
        created_at: new Date(),
        likes: 4,
        comments: 1,
        self: false,
        selfRating: false,
        fadeIn: false,
        attachments: []
    }

    return (
        <div className={styles.postPage}>
            <div className={styles.top}>
                <div className={styles.backArrow}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <rect width="24" height="24" fill="none"/>
                        <path fill="currentColor"
                              d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1"/>
                    </svg>
                </div>

                <h2>Question</h2>
            </div>

            <article className={styles.postBody}>
                <div className={postStyles.postHead}>

                    <div className={postStyles.postInfo}>
                        <div className={postStyles.authorName}>{post.author}</div>
                        <div className={"text-separator"}>
                            <span>·</span>
                        </div>
                        <time
                            dateTime={post.created_at.toString()}
                            title={dayjs(post.created_at).format("MMM D, YYYY h:mm A")}
                            className={styles.time}
                        >{formatRelativeTime(new Date(post.created_at))}</time>
                    </div>
                    <div className={postStyles.postOptions} onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                            <rect width="256" height="256" fill="none"/>
                            <path fill="currentColor"
                                  d="M144 128a16 16 0 1 1-16-16a16 16 0 0 1 16 16m-84-16a16 16 0 1 0 16 16a16 16 0 0 0-16-16m136 0a16 16 0 1 0 16 16a16 16 0 0 0-16-16"/>
                        </svg>
                    </div>


                </div>

                <div className={styles.postText}>

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
                                    <div style={{backgroundImage: `url(${attachment.url})`}}
                                         className={styles.imageDiv}>
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


                <div className={`${styles.postFooter} ${postStyles.postFooter}`}>
                    <PostInteractions likes={post.likes} id={post.id}
                                      self={post.selfRating} comments={post.comments}/>


                </div>

            </article>

            <ReplyField/>

            <div className={styles.noReplies}>
                <span>Be the first to answer the question!</span>
            </div>
        </div>
    )

}