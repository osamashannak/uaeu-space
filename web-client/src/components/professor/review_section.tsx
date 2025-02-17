import {ReviewAPI} from "../../typed/professor.ts";
import styles from "../../styles/pages/professor.module.scss";
import {pluralize} from "../../utils.tsx";
import Review from "./review.tsx";
import reviewStyles from "../../styles/components/professor/review.module.scss";
import SortReviews from "./sort_reviews.tsx";
import ReviewAd from "../advertisement/review_ad.tsx";


export default function ReviewSection(props: { professorReviews: ReviewAPI[] }) {

    const reviews = props.professorReviews;
    const reviewCount = reviews.length;

    const adUrl = 'https://s3.me-central-1.amazonaws.com/static.spaceread.net/ad/88students.jpg';

    return (
        <div className={styles.commentsSection}>
            <div className={styles.sortButtonWrapper}>
                <div className={styles.commentsCount}>
                    <span>{reviewCount} {pluralize(reviewCount, "Comment")}</span>
                </div>
                <div>
                    <SortReviews/>
                </div>
            </div>


            <div className={reviewStyles.commentsList}>

                {
                    reviewCount > 1 && <ReviewAd adUrl={adUrl} imageHeight={2251} imageWidth={4000} text={'Get 10% off your next order with code SPACEREAD! '} urlText={"https://wa.me/qr/37BIBC2LRMFRB1"}/>
                }

                {
                    reviewCount > 0 ?
                        reviews.map(value =>
                            <Review key={value.id} {...value}/>
                        )
                        : <div className={reviewStyles.noComments}><span>There are no comments.</span></div>
                }


            </div>
        </div>
    )
}
