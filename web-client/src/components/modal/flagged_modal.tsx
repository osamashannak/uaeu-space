import flaggedImage from "../../assets/images/flagged_modal_image.png";
import styles from "../../styles/components/global/modal.module.scss";

export default function FlaggedModal(props: {
    finalizeSubmission: () => void;
    editReview: () => void;
    onClose: () => void;
}) {

    return (
        <div className={styles.background}>
            <div className={styles.modalBody}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <div>
                        <div className={styles.title}>
                            <span>Want to take another look?</span>
                        </div>
                        <div className={styles.text}>
                            Some of the wording in your review might come across as offensive and inappropriate.
                        </div>
                        <div className={styles.text}>
                            If that wasn’t your intention, you can edit it and try again.
                        </div>
                    </div>

                    <div>
                        <img src={flaggedImage} alt="Flagged review" className={styles.modalImage}
                             width={200}
                             height={200}/>
                    </div>
                </div>
                <div className={styles.modalButtons}>
                    <button className={styles.buttonOk} onClick={() => {
                        props.editReview();
                        props.onClose();
                    }}>Edit review
                    </button>
                    <button className={styles.buttonRed} onClick={() => {
                        props.finalizeSubmission();
                        props.onClose();
                    }}>Post anyway
                    </button>
                </div>
            </div>
        </div>
    );
}
