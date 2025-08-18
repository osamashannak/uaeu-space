import {useEffect, useState} from "react";
import styles from "../../styles/pages/professor.module.scss";
import {SORT_BY, sortReviews} from "../../redux/slice/professor_slice.ts";
import {useDispatch} from "react-redux";


export default function SortReviews() {

    const [sortHidden, setSortHidden] = useState(true);
    const dispatch = useDispatch();

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

    useEffect(() => {
        function onClickAway(event: MouseEvent) {
            if (!(event.target as HTMLElement).classList.contains(styles.sortButton)) {
                setSortHidden(true);
            }
        }

        window.addEventListener("click", onClickAway);

        return () => {
            window.removeEventListener("click", onClickAway);
        };
    }, []);


    return (
        <>
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
        </>
    )

}