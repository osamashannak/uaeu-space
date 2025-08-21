import styles from "../../styles/components/professor/review.module.scss";
import {useEffect, useRef, useState} from "react";
import sortStyles from "../../styles/pages/professor.module.scss";
import {ReviewAPI} from "../../typed/professor.ts";
import {useModal} from "../provider/modal.tsx";
import ReviewDeletionModal from "../modal/review_deletion_modal.tsx";
import ReportReviewModal from "../modal/report_review_modal.tsx";


export default function ReviewOptions(props: {
    review: ReviewAPI,
}) {

    const modal = useModal();
    const [showList, setShowList] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setShowList(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className={styles.reviewRight}>
            <div className={styles.viewMoreButton} onClick={() => {
                setShowList(!showList)
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
            {showList && <div className={sortStyles.sortByMenu}>
                <div className={sortStyles.sortByMenuList}>
                    <div className={sortStyles.sortByListItem}
                         onClick={() => {
                             modal.openModal(ReportReviewModal, {
                                 reviewId: props.review.id
                             });
                             setShowList(false);
                         }}>
                        <span>Report</span>
                    </div>
                    {props.review.self &&
                        <div className={sortStyles.sortByListItem}
                             onClick={() => {
                                 modal.openModal(ReviewDeletionModal, {
                                     reviewId: props.review.id
                                 });
                                 setShowList(false);
                             }}>
                            <span>Delete</span>
                        </div>
                    }
                </div>
            </div>}
        </div>

    )
}