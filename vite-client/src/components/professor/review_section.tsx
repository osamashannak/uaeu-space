import {useEffect, useState} from "react";
import {ReviewAPI} from "../../typed/professor.ts";
import styles from "../../styles/pages/professor.module.scss";
import {pluralize} from "../../utils.tsx";
import Review from "./review.tsx";
import reviewStyles from "../../styles/components/professor/review.module.scss";
import {SORT_BY, sortReviews} from "../../redux/slice/professor_slice.ts";
import {useDispatch} from "react-redux";


export default function ReviewSection(props: { professorReviews: ReviewAPI[] }) {

    const [sortBy, setSortBy] = useState<SORT_BY>(SORT_BY.relevant);
    const [sortHidden, setSortHidden] = useState(true);

    const dispatch = useDispatch();

    const reviews = props.professorReviews;
    const reviewCount = reviews.length;

    useEffect(() => {

        window.onclick = (event) => {
            if (!(event.target as HTMLElement).classList.contains(styles.sortButton)) {
                setSortHidden(true);
            }
        }

        return () => {
            window.onclick = null;
        }

    }, []);


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
                             dispatch(sortReviews(SORT_BY.relevant));
                         }}>
                        <span>Relevant</span>
                    </div>
                    <div className={styles.sortByListItem}
                         onClick={() => {
                             dispatch(sortReviews(SORT_BY.newest));
                         }}>
                        <span>Newest</span>
                    </div>
                </div>
            </div>

            <div className={styles.commentsList}>

                {
                    reviewCount > 0 ?
                        reviews.map(value =>
                            <Review key={value.id} {...value}/>
                        )
                    : <div className={reviewStyles.review}><span>There are no comments.</span></div>
                }


            </div>
        </div>
    )
}
