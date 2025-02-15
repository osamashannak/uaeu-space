import dayjs from "dayjs";
import {ReviewAPI, ReviewReplyAPI} from "../../typed/professor.ts";
import styles from "../../styles/components/professor/review.module.scss";
import {formatRelativeTime, parseText, ratingToIcon} from "../../utils.tsx";
import {useEffect, useState} from "react";
import ReviewRating from "./review_rating.tsx";
import ReviewDeletionModal from "./review_deletion_modal.tsx";
import ReplySection from "./reply_section.tsx";
import ReplyCompose from "./reply_compose.tsx";
import {CommentsContext} from "../../context/comments.ts";


export default function Review(review: ReviewAPI) {

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [replyCompose, showReplyCompose] = useState(false);
    const [comments, setComments] = useState<ReviewReplyAPI[]>([]);


    useEffect(() => {
        const p = document.getElementById(`review_comment_${review.id}`);

        if (!p) return;

        parseText(p);

    }, [review.id]);

    // if review is 7 days old or newer, add a new badge
    const reviewDate = new Date(review.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - reviewDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return (
        <div className={styles.reviewWrapper}>
            <article className={`${styles.review} ${review.fadeIn ? styles.fadeIn : ''}`}>
                <div className={styles.reviewInfo}>

                    <div className={styles.reviewInfoLeft}>
                        <div className={styles.reviewHead}>
                            <div className={styles.reviewInfoLeftTop}>
                                <div className={styles.authorName}>
                                    {review.self ? "You" : review.author}
                                </div>
                                <div className={"text-separator"}>
                                    <span>·</span>
                                </div>
                                <time
                                    dateTime={review.created_at.toString()}
                                    title={dayjs(review.created_at).format("MMM D, YYYY h:mm A")}
                                    className={styles.time}
                                >{formatRelativeTime(new Date(review.created_at))}</time>

                                {diffDays < 7 && <div className={styles.new}>
                                    <span>NEW</span>
                                </div>}
                            </div>

                        </div>
                        <div className={styles.reviewInfoRight}>
                            <div className={styles.reviewStars}>
                                <span title={review.score.toString()}>{ratingToIcon(review.score)}</span>
                            </div>
                            <div className={styles.recommendation}>
                                <span>{review.positive ? "Recommend" : "Not recommended"}</span>
                            </div>
                        </div>
                    </div>


                </div>

                <div className={styles.reviewBody}>

                    <p dir={"auto"} id={`review_comment_${review.id}`}>
                        {review.comment.trim()}
                    </p>

                    {review.attachments && <div className={styles.imageList}>
                        {review.attachments.map((attachment, index) => (
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
                    </div>}
                </div>


                <div className={styles.reviewFooter}>
                    <div>
                        <ReviewRating dislikes={review.dislikes} likes={review.likes} id={review.id}
                                      self={review.selfRating}/>
                    </div>

                    <div className={styles.comment} onClick={() => {
                        showReplyCompose(true);
                    }} onMouseDown={(e) => {
                        e.currentTarget.classList.add(styles.buttonClick);
                    }} onMouseUp={(e) => {
                        e.currentTarget.classList.remove(styles.buttonClick);
                    }} onMouseOut={(e) => {
                        e.currentTarget.classList.remove(styles.buttonClick);
                    }}>
                        <div className={styles.commentButton}>
                            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.89 1 4.127L3 21l4.873-1c1.236.639 2.64 1 4.127 1"/>
                            </svg>
                            <div className={styles.iconBackground}></div>
                        </div>
                        {review.comments > 0 && <span className={styles.commentCount}>{review.comments}</span>}
                    </div>

                    {review.self && <div className={styles.deleteButton} onClick={() => {
                        setDeleteConfirm(true);
                    }}>
                        <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                            <path fill="currentColor"
                                  d="M216 50h-42V40a22 22 0 0 0-22-22h-48a22 22 0 0 0-22 22v10H40a6 6 0 0 0 0 12h10v146a14 14 0 0 0 14 14h128a14 14 0 0 0 14-14V62h10a6 6 0 0 0 0-12M94 40a10 10 0 0 1 10-10h48a10 10 0 0 1 10 10v10H94Zm100 168a2 2 0 0 1-2 2H64a2 2 0 0 1-2-2V62h132Zm-84-104v64a6 6 0 0 1-12 0v-64a6 6 0 0 1 12 0m48 0v64a6 6 0 0 1-12 0v-64a6 6 0 0 1 12 0"/>
                        </svg>
                        <div className={styles.iconBackground}></div>
                    </div>}

                    {deleteConfirm && <ReviewDeletionModal setDeleteConfirm={setDeleteConfirm} reviewId={review.id}/>}


                    {review.uaeuOrigin &&
                        <div className={styles.uaeuOrigin} title={"This review was posted from UAEU internet."}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                      d="M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2s.06-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.92 7.92 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8 8 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.7 15.7 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/>
                            </svg>
                            <span>UAEU</span>
                        </div>}
                </div>

            </article>
            <CommentsContext.Provider value={{comments, setComments}}>
                {replyCompose &&
                    <ReplyCompose id={review.id} author={review.author} comment={review.comment} op={review.self}
                                  created_at={review.created_at} showReplyCompose={showReplyCompose}
                                  reviewId={review.id}/>}

                {review.comments > 0 &&
                    <ReplySection reviewId={review.id} comments={review.comments} op={review.self}/>}

            </CommentsContext.Provider>

        </div>
    );
}