import {ReviewAPI} from "../../typed/professor.ts";
import styles from "../../styles/pages/professor.module.scss";
import {pluralize} from "../../utils.tsx";
import reviewStyles from "../../styles/components/professor/review.module.scss";
import SortReviews from "./sort_reviews.tsx";
import RestrictedReview from "./restricted_review.tsx";


export default function RestrictedReviewSection(props: { professorReviews: ReviewAPI[] }) {

    let reviews = props.professorReviews;
    const reviewCount = reviews.length;

    const donationComment = reviews.find(r => r.id === "1141491675571425280");
    reviews = reviews.filter(r => r.id !== "1141491675571425280");

    return (
        <div className={styles.commentsSection}>
            <div className={styles.sortButtonWrapper}>
                <div className={styles.commentsCount}>
                    <span>{reviewCount} {pluralize(reviewCount, "Comment")}</span>
                </div>
                <div style={{visibility: "hidden"}}>
                    <SortReviews/>
                </div>
            </div>

            <RestrictedReview {...donationComment!} pinned/>


            <div className={reviewStyles.commentsList}>

                {
                    reviewCount > 0 ?
                        reviews.map(value =>
                            <RestrictedReview key={value.id} {...value}/>
                        )
                        : <div className={reviewStyles.noComments}><span>There are no comments.</span></div>
                }


            </div>
        </div>
    )
}
