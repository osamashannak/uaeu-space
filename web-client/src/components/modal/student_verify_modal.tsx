import {useState, useRef, useEffect} from "react";
import styles from "../../styles/components/global/modal.module.scss";
import {verifyStudentEmail} from "../../api/professor.ts";

export default function StudentVerifyModal({ onClose }: {
    onClose: () => void,
}) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const responseDivRef = useRef<HTMLSpanElement>(null);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            onClose()
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleSendLink = async () => {
        if (!email) {
            responseDivRef.current!.innerHTML = "Please enter your email address.";
            responseDivRef.current!.style.color = "red";
            return;
        }

        const uaeuIdPattern = /^(202\d{6}|7000\d{5})@uaeu\.ac\.ae$/i;

        if (uaeuIdPattern.test(email)) {
            responseDivRef.current!.innerHTML = "Please enter a valid email address.";
            responseDivRef.current!.style.color = "red";
            return;
        }

        setLoading(true);
        responseDivRef.current!.innerHTML = "";

        try {
            const success = await verifyStudentEmail(email);

            if (!success) {
                responseDivRef.current!.innerHTML = "Failed to send email. Please try again.";
                responseDivRef.current!.style.color = "red";
                setLoading(false);
                return;
            }
            setSent(true);
        } catch (error) {
            responseDivRef.current!.innerHTML = "Failed to send email. Please try again.";
            responseDivRef.current!.style.color = "red";
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className={styles.background} onClick={onClose}>
                <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>

                    <span className={styles.title}>Link Sent!</span>

                    <div className={styles.text} style={{marginBottom: '15px'}}>
                        A one-time login link has been sent to <b>{email}</b>. Please check your inbox and spam folder.
                    </div>

                    <div className={styles.modalButtons}>
                        <div className={styles.buttonOk} onClick={onClose}>
                            Ok
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    return (
        <div className={styles.background} onClick={onClose}>
            <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>

                <span className={styles.title}>Verify Student Status</span>

                <div className={styles.text} style={{marginBottom: '15px'}}>
                    Enter your university email. We will send you a one-time login link.
                    <br/>
                    <span style={{fontSize: '13px', color: '#808080'}}>
                        This is just to confirm you are student at UAEU. Your email will not be stored or linked to the review.
                    </span>
                </div>

                <input
                    type="email"
                    placeholder="student@uaeu.ac.ae"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '16px',
                        border: '1px solid #E5E5E5',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        outline: 'none'
                    }}
                />

                <div className={styles.modalButtons}>
                    <div
                        className={styles.buttonOk}
                        style={{ backgroundColor: '#049AE5', color: 'white', border: 'none' }}
                        onClick={!loading ? handleSendLink : undefined}
                    >
                        {loading ? "Sending..." : "Send Link"}
                    </div>

                    {/* Cancel Action */}
                    <div className={styles.buttonOk} onClick={onClose}>
                        Cancel
                    </div>
                </div>

                <div className={styles.responseMessage}>
                    <span ref={responseDivRef}></span>
                </div>
            </div>
        </div>
    )
}