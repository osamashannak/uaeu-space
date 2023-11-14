import reviewStyles from "@/styles/components/Review.module.scss";
import Skeleton from "react-loading-skeleton";
import Rating from "@/components/Professor/Rating";


const ReviewSkeleton = () => {
    return (
        <article className={reviewStyles.review}>

            <div className={reviewStyles.reviewInfo}>
                <div className={reviewStyles.reviewInfoLeft}>
                    <div className={reviewStyles.authorName} style={{width: "93px"}}>
                        <span><Skeleton/></span>
                    </div>
                    <div className={"text-separator"}>
                        <span>·</span>
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

            <div className={reviewStyles.reviewFooter}>
                <div>
                    <Rating dislikes={0} likes={0} id={0} type={"review"}/>
                </div>
            </div>

        </article>
    )
};

export default ReviewSkeleton;