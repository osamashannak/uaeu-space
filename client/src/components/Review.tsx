<<<<<<< HEAD
import {IReview, ratingToIcon} from "../utils/Professor";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import {dateHumanize} from "../utils/Global";
import LikeDislike from "./LikeDislike";


const Review = (props: IReview) => {
    const {t, i18n} = useTranslation(namespaces.pages.professor);

    return (
        <div className={"review"}>

            <div className={"review-info"}>
                <p className={"reviewer"}>{props.author}</p>
                <p className={"recommendation"}>{props.positive ? t("recommend",) : t("not_recommend")}</p>
            </div>

            <div className={"review-body"}>
                <div className={"review-comment"}>{props.comment}</div>
                <div className={"review-scores"}>
                    <span className={"stars"}>{ratingToIcon(props.score)}</span>
                </div>
            </div>
            <div className={"review-footer"}>
                <p>{dateHumanize(props.created_at, i18n.language || window.localStorage.i18nextLng)}</p>
                <LikeDislike id={props.id}/>
            </div>

        </div>
    );
}


=======
import {useState} from "react";
import {ratingToIcon} from "@/utils";
import styles from "@/styles/components/Review.module.scss";
import Rating from "@/components/Rating";
import dayjs from "dayjs";

import relativeTime from 'dayjs/plugin/relativeTime';
import {ReviewAPI} from "@/interface/professor";
import {DashboardReviewAPI} from "@/interface/dashboard";

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
                <p>{props.author}</p>
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
                    <span>{'author_ip' in props ? props.created_at.toString() : dayjs(props.created_at).fromNow()}</span>
                    ·
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

>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
export default Review;