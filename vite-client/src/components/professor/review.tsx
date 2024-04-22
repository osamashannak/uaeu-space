import dayjs from "dayjs";
import {ReviewAPI} from "../../typed/professor.ts";
import styles from "../../styles/components/professor/review.module.scss";
import {formatRelativeTime, parseText, ratingToIcon} from "../../utils.tsx";
import {useEffect} from "react";
import ReviewRating from "./review_rating.tsx";

export default function Review(review: ReviewAPI) {


    useEffect(() => {
        const p = document.getElementById(`review_comment_${review.id}`);

        if (!p) return;

        parseText(p);

    }, [review.id]);

    return (
        <article className={`${styles.review} ${review.fadeIn ? styles.fadeIn : ''}`}>
            <div className={styles.reviewInfo}>

                <div className={styles.reviewInfoLeft}>
                    <div className={styles.reviewInfoLeftTop}>
                        <div className={styles.authorName}>
                            {
                                review.self ? "You" : review.author
                            }
                        </div>
                        <div className={"text-separator"}>
                            <span>·</span>
                        </div>
                        <time
                            dateTime={review.created_at.toString()}
                            title={dayjs(review.created_at).format("MMM D, YYYY h:mm A")}
                            className={styles.time}
                        >{formatRelativeTime(new Date(review.created_at))}</time>

                    </div>
                    {review.uaeuOrigin &&
                        <div className={styles.uaeuOrigin}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                      d="M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2s.06-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.92 7.92 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8 8 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.7 15.7 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/>
                            </svg>
                            <span>From UAEU internet</span>
                        </div>}
                </div>

                <div className={styles.reviewInfoRight}>
                    <div>
                        <span>{review.positive ? "Recommend" : "Not recommended"}</span>
                    </div>
                    <div>
                        <span title={review.score.toString()}>{ratingToIcon(review.score)}</span>
                    </div>
                </div>
            </div>

            <div className={styles.reviewBody}>

                <p dir={"auto"} id={`review_comment_${review.id}`}>
                    {review.comment.trim()}
                </p>

                <div className={styles.imageList}>
                    {
                        review.attachments && review.attachments.map((attachment, index) => (
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

            <div className={styles.reviewFooter}>
                <div>
                    <ReviewRating dislikes={review.dislikes} likes={review.likes} id={review.id}
                                  self={review.selfRating}/>
                </div>
            </div>

        </article>
    );
}