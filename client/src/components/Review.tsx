import {IReview} from "../utils/Professor";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import {dateHumanize, ratingToIcon, RatingType} from "../utils/Global";
import {Icon} from '@iconify/react';
import flagRounded from '@iconify/icons-material-symbols/flag-rounded';
import {useState} from "react";
import Rating from "./Rating";


const Review = (props: IReview) => {
    const {t, i18n} = useTranslation(namespaces.pages.professor);

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
        <div className={"review"}>
            <div style={{display: popup ? "flex" : "none"}}
                 className={`review-flag-modal review-flag-modal-${props.id}`}>
                <div className={"review-flag-modal-box"}>
                    <span>Flag Review</span>
                    <p>Are you sure you want to flag this review?</p>
                    <div onClick={flagReview} className={"review-flag-modal-button"}>Yes</div>
                    <span onClick={closePopup} className={"close"}>&times;</span>
                </div>
            </div>
            <div className={"review-info"}>
                <p className={"reviewer"}>{props.author}</p>
                <span className={"recommendation"}>
                    <p>{props.positive ? t("recommend",) : t("not_recommend")}</p>
                    <span className={"stars"}>{ratingToIcon(props.score)}</span>
                </span>
            </div>

            <div className={"review-body"}>
                <p dir={"auto"} className={"review-comment"}>{props.comment}</p>
            </div>
            <div className={"review-footer"}>
                <div className={"review-footer-left"}>
                    <p>{dateHumanize(props.created_at, i18n.language || window.localStorage.i18nextLng)}</p>
                    ·
                    <Rating id={props.id} dislikes={props.dislikes} likes={props.likes} type={RatingType.Review}/>
                </div>
                <Icon onClick={!isFlagged ? flagReviewPopup : () => {
                }} style={isFlagged ? {color: "red", cursor: "default"} : {color: "inherit", cursor: "pointer"}}
                      className={`flag-review flag-review-${props.id}`}
                      icon={flagRounded}/>
            </div>

        </div>
    );
}


export default Review;