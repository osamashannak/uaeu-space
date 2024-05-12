import {useEffect} from "react";
import styles from "../../styles/components/professor/review.module.scss";
import {deleteReview} from "../../api/professor.ts";


export default function ReviewDeletionModal({reviewId, setDeleteConfirm}: { reviewId: number, setDeleteConfirm: (value: boolean) => void }) {

    useEffect(() => {
        const screen = document.querySelector(`.${styles.deleteConfirm}`) as HTMLDivElement;
        screen.style.display = "flex";

        const html = document.querySelector("html") as HTMLHtmlElement;
        html.style.overflow = "hidden";

        return () => {
            screen.style.display = "none";
            html.style.removeProperty("overflow");
        }

    }, []);

    return (
        <div>
            <div className={styles.deleteConfirm}>
                <div className={styles.deleteConfirmModal}>
                    <span className={styles.title}>Are you sure you want to delete this review?</span>
                    <div className={styles.caution}>This action is irreversible.</div>
                    <div style={{display: "flex", gap: "8px", alignContent: "center"}}>
                        <div className={styles.button} onClick={async () => {
                            const button = document.querySelector(`.${styles.button}`) as HTMLDivElement;
                            button.style.pointerEvents = "none";
                            button.style.opacity = "0.5";

                            const cancelButton = document.querySelector(`.${styles.cancel}`) as HTMLDivElement;
                            cancelButton.style.pointerEvents = "none";
                            cancelButton.style.opacity = "0.5";

                            await deleteReview(reviewId);
                            setDeleteConfirm(false);
                        }}>Delete
                        </div>
                        <div className={styles.cancel} onClick={() => {
                            setDeleteConfirm(false);
                        }}>Cancel
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )


}