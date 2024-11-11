import styles from "../../styles/pages/professor.module.scss";
import {SimilarProfessors} from "../../typed/professor.ts";
import {useNavigate} from "react-router-dom";

export default function RelatedReviews(props: {reviews: SimilarProfessors[]}) {

    const navigate = useNavigate();

    return (
        <section className={styles.relatedProfSection}>
            <div className={styles.relatedProfAbout}>
                <h2 className={styles.largeText}>Professors for you</h2>
                <span className={styles.subText}>View professors that might be related</span>
            </div>

            {props.reviews.map((value, index) => {
                return <div key={index} className={styles.relatedProf} onClick={() => {
                    navigate(`/professor/${value.professor_email}`)
                }}>
                    <div className={styles.relatedProfScore}>
                        <span>{value.score.toFixed(1)}</span>
                    </div>
                    <div>
                        <div className={styles.relatedProfScore}>
                            <span className={styles.relatedProfName}>{value.professor_name}</span>
                        </div>
                        <div dir={"auto"} className={styles.relatedProfReview}>
                            <span>{value.review.slice(0, 100).trim()}... </span>
                            <span className={styles.readMore}>Read more</span>
                        </div>
                        <div className={styles.relatedProfInfo}>
                            {value.reviewCount > 5 ? <span>{Math.floor(value.reviewCount / 5) * 5}+ comments</span> :
                                <span>{value.reviewCount}+ comments</span>
                            }
                            <div className={"text-separator"}>
                                <span>·</span>
                            </div>
                            <span>{value.professor_college}</span>

                        </div>
                    </div>
                </div>
            })}

        </section>
    )

}