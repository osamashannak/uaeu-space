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
                    <div className={styles.authorName}>
                        <span>{review.author}</span>
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
                    {review.comment}
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
                    <ReviewRating dislikes={review.dislikes} likes={review.likes} id={review.id} type={"review"}/>
                </div>
            </div>

        </article>
    );
}