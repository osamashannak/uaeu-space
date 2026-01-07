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

    const adUrl = 'https://instagram.ffjr1-1.fna.fbcdn.net/v/t51.82787-15/601793323_17853669267597866_966317454204644333_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzc4OTY3Mjg1MTYyNDc2NjI0OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=lQ-9IGlF8sUQ7kNvwHkpEkX&_nc_oc=Adm553tw2Z-uBpJffYFDOV0thVFsYgF3pzuGQiz_KwP1q27QUPQVir3_9_pQwy-rXVNfQm5Vf6CpMPxSHsgdpRHx&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.ffjr1-1.fna&_nc_gid=XYZJidic-fXwLCKFjr4EYg&oh=00_AfpFPk9StNyqjzNRAr2zd-E0q9tsbJdD8ZPnXasB8HNEeg&oe=6963C812';

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
                    reviewCount > 1 && <ReviewAd adUrl={adUrl} imageHeight={2251} imageWidth={4000} text={'From wood to metal.. the most precise laser engraving you can see. Browse our work and book your order now: '} urlText={"https://instagram.com/miza_3d_printing"}/>
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
