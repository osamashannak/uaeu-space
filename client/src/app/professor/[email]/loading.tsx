import Skeleton from 'react-loading-skeleton'
import styles from "@/styles/Professor.module.scss";
import 'react-loading-skeleton/dist/skeleton.css'
import Rating from "@/components/Professor/Rating";
import reviewStyles from "@/styles/components/Review.module.scss";
import ReviewSkeleton from "@/app/professor/[email]/ReviewSkeleton";

const Loading = () => {
    return (
        <div className={styles.profPage}>

            <section className={styles.profInfoHead}>
                <div className={styles.profInfoLeft}>
                    <h1 style={{width: "100px"}}><Skeleton /></h1>
                    <p style={{width: "200px"}}><Skeleton /></p>
                </div>

                <div className={styles.profInfoRight}>
                    <p className={styles.score}><Skeleton /></p>
                </div>
            </section>

            <div className={styles.commentsSection}>


                <ReviewSkeleton/>
                <ReviewSkeleton/>
                <ReviewSkeleton/>
                <ReviewSkeleton/>

            </div>

        </div>
    )
}

export default Loading;