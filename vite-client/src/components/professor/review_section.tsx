import {useState} from "react";
import {ReviewAPI} from "../../typed/professor.ts";
import styles from "../../styles/pages/professor.module.scss";
import Review from "./review.tsx";
import reviewStyles from "../../styles/components/professor/review.module.scss";

enum SORT_BY {
    rated,
    newest
}

export default function ReviewSection (props: { professorReviews: ReviewAPI[] }) {

    const [sortHidden, setSortHidden] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<SORT_BY>(SORT_BY.newest);
    const [reviews, setReviews] = useState(props.professorReviews);

    console.log(sortBy)

    /*useEffect(() => {
        if (reviews == null) {
            return;
        }

        if (sortBy === SORT_BY.newest) {
            setReviews(reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } else {
            setReviews(reviews.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes)));
        }
    }, [reviews, sortBy]);*/

    const reviewCount = reviews.length;

    return (
        <div className={styles.commentsSection}>
            <div className={styles.sortButtonWrapper}>
                <div className={styles.commentsCount}>
                    <span>{reviewCount} Comments</span>
                </div>
                <div className={styles.sortButton}
                     onClick={(event) => {
                         event.preventDefault();
                         setSortHidden(!sortHidden);
                     }}>
                    <div className={styles.sortIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M4 18h4c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1zm1 6h10c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1z"/>
                        </svg>
                        <div className={styles.sortIconBackground}></div>
                    </div>
                    <span>Sort by</span>
                </div>
            </div>

            <div hidden={sortHidden} className={styles.sortByMenu}>
                <div className={styles.sortByMenuList}>
                    <div className={styles.sortByListItem}
                         onClick={() => {
                             setReviews((prevReviews) =>
                                 [...prevReviews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                             );

                         }}>
                        <span>Rated</span>
                    </div>
                    <div className={styles.sortByListItem}
                         onClick={() => {
                             setReviews((prevReviews) =>
                                 [...prevReviews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                             );

                         }}>
                        <span>Newest</span>
                    </div>
                </div>
            </div>

            <section>
                {
                    reviewCount > 0 ? reviews.map((review) => (
                        <>
                            <Review key={review.id} {...review}/>
                            {/*{Math.floor(reviewCount / 2) === index &&
                                    <ResponsiveAdUnit slotId={8705186952}/>}*/}
                        </>
                    )) : <p className={reviewStyles.review}>{"There are no comments."}</p>
                }
            </section>
        </div>
    )
}
