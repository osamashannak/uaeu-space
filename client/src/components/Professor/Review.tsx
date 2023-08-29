import {useState} from "react";
import {ratingToIcon} from "@/utils";
import styles from "@/styles/components/Review.module.scss";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {ReviewAPI} from "@/interface/professor";
import {DashboardReviewAPI} from "@/interface/dashboard";
import Rating from "@/components/Professor/Rating";

dayjs.extend(relativeTime)

const Review = (props: ReviewAPI | DashboardReviewAPI) => {

    const [isFlagged, setIsFlagged] = useState(false);
    const [popup, setPopup] = useState(false);

    const flagReview = () => {
        setIsFlagged(true);
        closePopup();

        // todo send flag to server
    }

    const flagReviewPopup = () => {
        setPopup(true);
    }

    const closePopup = () => {
        setPopup(false);
    }

    return (
        <article className={styles.review}>
            <div style={{display: popup ? "flex" : "none"}} className={styles.flagModal}>
                <div className={styles.flagModelBox}>
                    <span>Flag Review</span>
                    <p>Are you sure you want to flag this review?</p>
                    <div onClick={flagReview} className={styles.flagModalButton}>Yes</div>
                    <span onClick={closePopup} className={styles.close}>&times;</span>
                </div>
            </div>

            <div className={styles.reviewInfo}>
                <div>
                    <span>{props.author}</span>
                    <span className={"text-separator"}>·</span>
                    <time
                        dateTime={props.created_at.toString()}
                        title={dayjs(props.created_at).format("MMM D, YYYY h:mm A")}
                        className={styles.time}
                    >{dayjs(props.created_at).fromNow(true)}</time>
                </div>
                <span>
                    <p>{props.positive ? "Recommend" : "Not recommended"}</p>
                    <span className={styles.stars}>{ratingToIcon(props.score)}</span>
                </span>
            </div>

            <div className={styles.reviewBody}>
                <p dir={"auto"}>{props.comment}</p>
            </div>

            <div className={styles.reviewFooter}>
                <div>
                    <Rating dislikes={props.dislikes} likes={props.likes} id={props.id} type={"review"}/>
                </div>
                <svg
                    className={isFlagged ? styles.flagReviewPressed : styles.flagReview}
                    onClick={!isFlagged ? flagReviewPopup : undefined}
                    style={isFlagged ? {color: "red", cursor: "default"} : {color: "inherit", cursor: "pointer"}}
                    xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5 21V4h9l.4 2H20v10h-7l-.4-2H7v7H5Z"/>
                </svg>
            </div>

        </article>
    );
}

export default Review;