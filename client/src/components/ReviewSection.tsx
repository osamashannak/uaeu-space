import Review from "./Review";
import {ReactComponent as ReviewIcon} from "../assests/rate-review-outline-rounded.svg";
import {useEffect, useState} from "react";
import {ReviewProps} from "../utils/Professor";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";

const ReviewSection = (props: { reviews: ReviewProps[] }) => {
    const {t, i18n} = useTranslation(namespaces.pages.professor);

    const [reviews, setReviews] = useState<ReviewProps[]>([]);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        setReviews(props.reviews);

    }, []);

    return (
        <div className={"ratings-section"}>
            <p className={"ratings-title"}><ReviewIcon className={"review-icon"}/> {t("comments")}</p>
            {
                reviews.map((review, index) => (
                    <Review key={index} {...review}/>
                ))
            }
        </div>
    );
}

export default ReviewSection;