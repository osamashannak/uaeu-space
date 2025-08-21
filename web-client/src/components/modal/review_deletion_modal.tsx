import {deleteReview} from "../../api/professor.ts";
import {useDispatch} from "react-redux";
import {removeReview} from "../../redux/slice/professor_slice.ts";
import styles from "../../styles/components/global/modal.module.scss";
import {useRef} from "react";


export default function ReviewDeletionModal({reviewId, onClose}: {
    reviewId: string,
    onClose: () => void,
}) {

    const dispatch = useDispatch();
    const responseDivRef = useRef<HTMLSpanElement>(null);

    return (
        <div className={styles.background}>
            <div className={styles.modalBody}>
                <span className={styles.title}>Are you sure you want to delete this review?</span>
                <div className={styles.text}>This action is irreversible.</div>
                <div className={styles.modalButtons}>
                    <div className={styles.buttonRed} onClick={async () => {
                        const status = await deleteReview(reviewId);

                        if (status?.success) {
                            dispatch(removeReview(reviewId));
                            onClose();
                        }

                        responseDivRef.current!.innerHTML = "An error occurred while deleting the review.";

                    }}>Delete
                    </div>
                    <div className={styles.buttonOk} onClick={() => {
                        onClose();
                    }}>Cancel
                    </div>
                </div>
                <div className={styles.responseMessage}>
                    <span ref={responseDivRef}></span>
                </div>
            </div>
        </div>
    )


}