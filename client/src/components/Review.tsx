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
                <p>{dateHumanize(props.created_at, i18n.language)}</p>
                <LikeDislike id={props.id}/>
            </div>

        </div>
    );
}


export default Review;