import styles from "../../styles/components/professor/review.module.scss";
import {useEffect, useState} from "react";
import sortStyles from "../../styles/pages/professor.module.scss";


export default function ReviewOptions() {

    const [sortHidden, setSortHidden] = useState(true);

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
        <div className={styles.reviewRight}>
            <div className={styles.viewMoreButton} onClick={(event) => {
                event.stopPropagation();
                setSortHidden(!sortHidden)
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <g fill="currentColor">
                        <circle cx="6" cy="12" r="1.75"/>
                        <circle cx="12" cy="12" r="1.75"/>
                        <circle cx="18" cy="12" r="1.75"/>
                    </g>
                </svg>
                <div className={styles.iconBackground}></div>
            </div>
            <div className={sortHidden ? sortStyles.hiddenSortByMenu : sortStyles.sortByMenu}>
                <div className={sortStyles.sortByMenuList}>
                    <div className={sortStyles.sortByListItem}
                         onClick={() => {
                         }}>
                        <span>Report</span>
                    </div>
                </div>
            </div>
        </div>

    )
}