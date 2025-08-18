import {ReviewFormDraft} from "../../typed/professor.ts";
import styles from "../../styles/components/professor/review_form.module.scss";
import {Dispatch, SetStateAction} from "react";

export default function ReviewAttachment(props: {
    details: ReviewFormDraft,
    setDetails: Dispatch<SetStateAction<ReviewFormDraft>>,
}) {

    const attachment = props.details.attachment;

    if (!attachment) {
        return null;
    }

    const aspectRatio = attachment.height / attachment.width;

    return (
        <>
            <div key={attachment.id} className={styles.imagePreview}
                 onClick={event => {
                     event.stopPropagation();
                     //window.open(attachment.url, '_blank');
                 }}>
                <div className={styles.deleteButton}
                     onClick={(event) => {
                         event.stopPropagation();
                         props.setDetails((prevDetails) => ({
                             ...prevDetails,
                             attachments: undefined,
                         }));
                         URL.revokeObjectURL(attachment.url);
                     }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 256 256">
                        <path fill="currentColor"
                              d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/>
                    </svg>
                </div>
                <div style={{paddingBottom: `${aspectRatio * 100}%`}}></div>
                <div style={{backgroundImage: `url(${attachment.url})`}}
                     className={styles.imageDiv}>
                </div>
                <img src={attachment.url}
                     draggable={false}
                     width={100}
                     height={100}
                     alt={""}/>
            </div>
            <div>
                {attachment.id.includes("tenor") &&
                    <span>Via Tenor</span>
                }
            </div>
        </>
    )
}