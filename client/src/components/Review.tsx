import {dateHumanize, ratingToIcon, ReviewProps} from "../utils/Professor";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";

const Review = (props: ReviewProps) => {
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
                    <p className={"cat"}>{t("quality")}: <span className={"stars"}>
                                {ratingToIcon(props.quality)}
                            </span></p>
                    <p className={"cat"}> {t("difficulty")}: <span className={"stars"}>
                                {ratingToIcon(props.difficulty)}
                            </span></p>
                </div>
            </div>
            <p>{dateHumanize(props.created_at, i18n.language)}</p>
        </div>
    );
}


export default Review;