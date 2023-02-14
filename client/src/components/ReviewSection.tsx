import Review from "./Review";
import {useEffect, useState} from "react";
import {IReview} from "../utils/Professor";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";

const ReviewSection = (props: { reviews: IReview[] }) => {
    const {t, i18n} = useTranslation(namespaces.pages.professor);

    const [reviews, setReviews] = useState<IReview[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        setReviews(props.reviews);
    }, []);

    return (
        <div className={"ratings-section"}>
            {
                reviews.length > 0 ? reviews.map((review, index) => (
                    <Review key={index} {...review}/>
                )) : <p className={"no-reviews"}>{t("new_review.status.no_reviews")}</p>
            }
        </div>
    );
}

export default ReviewSection;