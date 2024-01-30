import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {ReviewAPI} from "../../typed/professor.ts";
import styles from "../../styles/components/professor/review.module.scss";
import {formatRelativeTime, parseText, ratingToIcon} from "../../utils.tsx";
import {useEffect} from "react";
import ReviewRating from "./review_rating.tsx";

dayjs.extend(relativeTime)


export default function Review(review: ReviewAPI) {

    const attachment_url = "https://uaeuresources.blob.core.windows.net/attachments/" + review.attachment?.id; // todo use env

    useEffect(() => {
        const p = document.getElementById(`review_comment_${review.id}`);

        if (!p) return;

        parseText(p);

    }, [review.id]);

    return (
        <article className={styles.review}>

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
                        review.attachment &&
                        <div className={styles.attachment} onClick={() => {
                            window.open(attachment_url, "_blank");
                        }}>
                            <div
                                style={{paddingBottom: `${review.attachment.height / review.attachment.width * 100}%`}}></div>
                            <div style={{backgroundImage: `url(${attachment_url})`}} className={styles.imageDiv}>
                            </div>
                            <img src={attachment_url}
                                 draggable={false}
                                 width={100}
                                 height={100}
                                 alt={""}/>
                        </div>
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