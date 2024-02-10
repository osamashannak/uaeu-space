import {useState} from "react";
import {ReviewAPI} from "../../typed/professor.ts";
import styles from "../../styles/pages/professor.module.scss";
import Review from "./review.tsx";
import reviewStyles from "../../styles/components/professor/review.module.scss";
import {pluralize} from "../../utils.tsx";

enum SORT_BY {
    relevant,
    newest
}

export default function ReviewSection (props: { professorReviews: ReviewAPI[] }) {

    const [sortBy, setSortBy] = useState<SORT_BY>(SORT_BY.relevant);
    const [sortHidden, setSortHidden] = useState(true);

    let reviews = props.professorReviews;

    if (sortBy === SORT_BY.newest) {
        reviews = reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
        reviews = reviews.sort((a, b) => {
            const aDate = new Date(a.created_at).getTime();
            const bDate = new Date(b.created_at).getTime();
            const aLikes = a.likes - a.dislikes;
            const bLikes = b.likes - b.dislikes;

            if (aDate > Date.now() - 86400000 && bDate > Date.now() - 86400000) {
                return bDate - aDate;
            }
            if (aDate > Date.now() - 86400000) {
                return -1;
            }
            if (bDate > Date.now() - 86400000) {
                return 1;
            }
            if (aLikes !== bLikes) {
                return bLikes - aLikes;
            }
            return bDate - aDate;

        });
    }

    window.onclick = (event) => {
        if (!(event.target as HTMLElement).classList.contains(styles.sortButton)) {
            setSortHidden(true);
        }
    }

    const reviewCount = reviews.length;

    return (
        <div className={styles.commentsSection}>
            <div className={styles.sortButtonWrapper}>
                <div className={styles.commentsCount}>
                    <span>{reviewCount} {pluralize(reviewCount, "Comment")}</span>
                </div>
                <div className={styles.sortButton}
                     onClick={(event) => {
                         event.stopPropagation();
                         setSortHidden(!sortHidden)
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

            <div className={sortHidden ? styles.hiddenSortByMenu : styles.sortByMenu}>
                <div className={styles.sortByMenuList}>
                    <div className={styles.sortByListItem}
                         onClick={() => {
                             setSortBy(SORT_BY.rated);
                         }}>
                        <span>Relevant</span>
                    </div>
                    <div className={styles.sortByListItem}
                         onClick={() => {
                             setSortBy(SORT_BY.newest);
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
