import React, {useState, useRef, useEffect} from "react";
import styles from "../../styles/components/global/modal.module.scss";
import {submitOTP, verifyStudentEmail} from "../../api/professor.ts";

export default function StudentVerifyModal({onClose}: { onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const savedEmail = localStorage.getItem("pending_verification_email");
        const isSent = localStorage.getItem("verification_sent") === "true";

        if (savedEmail && isSent) {
            setEmail(savedEmail);
            setSent(true);
        }

        const handleStorageChange = () => onClose();
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [onClose]);

    useEffect(() => {
        const handleStorageChange = () => onClose();
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [onClose]);

    // Focus first OTP box when "sent" becomes true
    useEffect(() => {
        if (sent) {
            setTimeout(() => otpInputs.current[0]?.focus(), 100);
        }
    }, [sent]);

    const handleSendCode = async () => {
        if (!email) return setError("Please enter your email address.");

        const uaeuIdPattern = /^(202\d{6}|7000\d{5})@uaeu\.ac\.ae$/i;
        if (!uaeuIdPattern.test(email)) return setError("Please use a valid UAEU email.");

        setLoading(true);
        setError("");

        try {
            const success = await verifyStudentEmail(email);
            if (success) {
                localStorage.setItem("pending_verification_email", email);
                localStorage.setItem("verification_sent", "true");
                setSent(true);
            } else {
                setError("Failed to send code. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        // 1. Handle iOS Autofill or Paste (Full 6-digit code)
        if (value.length >= 6) {
            const digits = value.split("").slice(0, 6);
            const newOtp = [...otp];
            digits.forEach((d, i) => {
                if (i < 6) newOtp[i] = d;
            });
            setOtp(newOtp);
            // Focus the last box after autofill
            otpInputs.current[5]?.focus();
            return;
        }

        const char = value.slice(-1);

        if (char !== "" && isNaN(Number(char))) return;

        const newOtp = [...otp];
        newOtp[index] = char;
        setOtp(newOtp);

        if (char !== "") {
            if (index < 5) {
                otpInputs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpInputs.current[index - 1]?.focus();
        }
    };

    const handleVerifySubmit = async () => {
        const fullOtp = otp.join("");
        if (fullOtp.length < 6) return setError("Please enter the full 6-digit code.");

        setLoading(true);
        setError("");

        try {
            const success = await submitOTP(email, fullOtp);
            if (success) {
                localStorage.setItem("is_verified_student", "true");
                localStorage.removeItem("pending_verification_email");
                localStorage.removeItem("verification_sent");
                onClose();
            } else {
                setError("Invalid code. Please try again.");
                setOtp(new Array(6).fill(""));
                otpInputs.current[0]?.focus();
            }
        } catch (err) {
            setError("Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.background} onClick={onClose}>
            <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
                <span className={styles.title}>
                    {sent ? "Enter Verification Code" : "Verify Student Status"}
                </span>

                <div className={styles.text} style={{marginBottom: '15px', fontSize: '13px'}}>
                    {sent ? (
                        <>We sent a 6-digit code to <b>{email}</b></>
                    ) : (
                        <>
                            <span>Enter your university email to receive a 6-digit verification code.</span>
                            <br/>
                            <span>This is just to confirm you are student at UAEU. Your email will not be stored or linked to the review.</span>
                        </>
                    )}
                </div>

                {!sent ? (
                    <input
                        type="email"
                        placeholder="student@uaeu.ac.ae"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.modalInput}
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '4px',
                            borderRadius: '8px',
                            border: '1px solid #ddd'
                        }}
                    />
                ) : (
                    <div style={{display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px'}}>
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                onFocus={(e) => e.target.select()}
                                ref={(el) => {
                                    otpInputs.current[idx] = el
                                }}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code" // iOS Autofill Trigger
                                maxLength={6} // Allow 6 for paste detection
                                value={digit}
                                onChange={(e) => handleOtpChange(e.target.value, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                style={{
                                    width: '40px', height: '50px', textAlign: 'center',
                                    fontSize: '20px', fontWeight: 'bold', border: '2px solid #E5E5E5',
                                    borderRadius: '8px'
                                }}
                            />
                        ))}
                    </div>
                )}

                <div style={{color: 'red', fontSize: '12px', height: '32px'}}>{error}</div>

                <div className={styles.modalButtons}>
                    <div
                        className={styles.buttonOk}
                        style={{backgroundColor: '#049AE5', color: 'white', border: 'none'}}
                        onClick={loading ? undefined : (sent ? handleVerifySubmit : handleSendCode)}
                    >
                        {loading ? "Processing..." : (sent ? "Verify" : "Send Code")}
                    </div>
                    <div className={styles.buttonOk} onClick={onClose}>Cancel</div>
                </div>

                {sent && (
                    <div style={{marginTop: '15px'}}>
                        <span
                            style={{fontSize: '12px', color: '#049AE5', cursor: 'pointer', textDecoration: 'underline'}}
                            onClick={() => {
                                localStorage.removeItem("pending_verification_email");
                                localStorage.removeItem("verification_sent");
                                setSent(false);
                                setOtp(new Array(6).fill(""));
                            }}
                        >
                            Change email address
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}