import reviewStyles from "../../styles/components/professor/review.module.scss";
import Skeleton from "react-loading-skeleton";
import ReviewRating from "../professor/review_rating.tsx";


export default function ReviewSkeleton() {
    return (
        <article className={reviewStyles.review}>

            <div className={reviewStyles.reviewInfo}>
                <div className={reviewStyles.reviewInfoLeft}>
                    <div className={reviewStyles.authorName} style={{width: "93px"}}>
                        <span><Skeleton/></span>
                    </div>
                    <div className={reviewStyles.time} style={{width: "20px"}}>
                        <span><Skeleton/></span>
                    </div>
                </div>
                <div className={reviewStyles.reviewInfoRight}>
                    <div style={{width: "100px"}}>
                        <span><Skeleton/></span>
                    </div>
                    <div style={{width: "70px"}}>
                        <span><Skeleton/></span>
                    </div>
                </div>
            </div>

            <div className={reviewStyles.reviewBody}>
                <p dir={"auto"}><Skeleton count={3}/></p>
            </div>

        </article>
    )
}

