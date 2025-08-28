import styles from "../../styles/components/global/modal.module.scss";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useModal} from "../provider/modal.tsx";

function FeedbackRequest(props: {
    onClose: () => void;
}) {

    const navigate = useNavigate();

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

                <div style={{display: "flex", alignItems: "center"}}>
                    <div>
                        <div className={styles.title}>
                            <span>We want your feedback! 🙂</span>
                        </div>
                        <div className={styles.text}>
                            Help us improve SpaceRead and tell us if you’d join a UAEU Gaming Community or want a course
                            notifier. It will be quick!
                        </div>
                    </div>
                </div>
                <div className={styles.modalButtons}>
                    <button className={styles.buttonOk} onClick={() => {
                        navigate("/feedback");
                        props.onClose();
                    }}>Sure
                    </button>
                    <button className={styles.buttonRed} onClick={() => {
                        props.onClose();
                    }}>No, thanks ☹️
                    </button>
                </div>
            </div>
        </div>
    );
}


export default function useFeedbackPopup(professorExists: boolean) {
    const modal = useModal();

    useEffect(() => {
        if (!professorExists) return; // Only show if professor exists

        // Prevent multiple triggers
        const shown = sessionStorage.getItem("feedbackPopupShown");
        if (shown) return;

        let triggered = false;

        // 1️⃣ Trigger after 15 seconds
        const timeout = setTimeout(() => {
            modal.openModal(FeedbackRequest);
            sessionStorage.setItem("feedbackPopupShown", "true");
            triggered = true;
        }, 15000);

        // 2️⃣ Trigger if user scrolls halfway
        const handleScroll = () => {
            if (triggered) return;
            const scrollPosition = window.scrollY + window.innerHeight;
            const halfway = document.body.scrollHeight / 2;

            if (scrollPosition >= halfway) {
                modal.openModal(FeedbackRequest);
                sessionStorage.setItem("feedbackPopupShown", "true");
                triggered = true;
                window.removeEventListener("scroll", handleScroll);
                clearTimeout(timeout);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup
        return () => {
            clearTimeout(timeout);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [professorExists]);
};
