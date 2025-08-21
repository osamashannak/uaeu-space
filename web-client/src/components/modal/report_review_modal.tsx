import styles from "../../styles/components/global/modal.module.scss";
import {useRef, useState} from "react";
import {reportReview} from "../../api/professor.ts";

export default function ReportReviewModal(props: {
    reviewId: string,
    onClose: () => void,
}) {

    const reasonRef = useRef<HTMLTextAreaElement>(null);
    const responseMessageRef = useRef<HTMLSpanElement>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    if (showConfirmation) {
        return (
            <div className={styles.background}>
                <div className={styles.modalBody}>
                    <span className={styles.title}>Thank you for your report!</span>
                    <div className={styles.text}>Your report has been submitted successfully.</div>
                    <div className={styles.modalButtons}>
                        <div className={styles.buttonOk} onClick={() => {
                            props.onClose();
                        }}>Close
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.background}>
            <div className={styles.modalBody}>
                <div className={styles.closeButton} onClick={props.onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <rect width="24" height="24" fill="none"/>
                        <path fill="currentColor"
                              d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/>
                    </svg>
                </div>
                <div style={{marginBottom: "32px"}}></div>
                <div className={styles.title}>
                    Report Review
                </div>
                <div className={styles.text}>
                    Please provide a reason.
                </div>
                <textarea ref={reasonRef} className={styles.textArea}/>
                <div className={styles.modalButtons}>
                    <button className={styles.buttonOk} onClick={() => {
                        const reason = (reasonRef.current?.value ?? "").trim();

                        reportReview(props.reviewId, reason).then((response) => {
                            if (!response) {
                                responseMessageRef.current!.innerText = "Failed to report review. Please try again later.";
                            } else {
                                setShowConfirmation(true);
                            }
                        });

                    }}>Report
                    </button>
                </div>
                <div className={styles.responseMessage}>
                    <span ref={responseMessageRef}></span>
                </div>
            </div>
        </div>
    )

}