import {Helmet} from "react-helmet-async";
import styles from "../styles/components/course/swap.module.scss";
import {useState} from "react";


export default function CourseSwap() {

    const [haveCRN, setHaveCRN] = useState('');
    const [wantCRN, setWantCRN] = useState('');

    const submitting = false;

    function submit() {
        if (!formFilled()) {
            return;
        }

    }

    function formFilled() {
        return haveCRN || wantCRN;
    }

    return (
        <>
            <Helmet>
                <title>Course Swap - SpaceRead</title>
            </Helmet>
            <div className={styles.page}>
                <div className={styles.head}>
                    <div className={styles.title}>
                        <span>Course Swap</span>
                    </div>
                    <span className={styles.about}>Find other students to swap courses with</span>

                </div>


                <div className={styles.field}>
                    <div className={styles.fieldName}>
                        <span>What do you have? (Optional)</span>
                    </div>
                    <div className={styles.fieldBody}>
                        <div className={styles.fieldInput}>
                            <input placeholder={"CRN"} type={"text"}/>
                        </div>
                    </div>
                </div>

                <div className={styles.foundCRNWrapper}>
                    <div className={styles.crnTitle}>
                        <span>Course Details</span>
                    </div>
                    <div className={styles.foundCRN}>
                        <div>
                            <span className={styles.courseTag}>ACCT111</span>
                            <span> Principles of Financial Acct</span>
                        </div>
                        <div className={styles.courseInstructor}>
                            <span>Abouelsood, Heba</span>
                        </div>
                        <div className={styles.courseTime}>
                            <span>M/W 12:30-13:45</span>
                        </div>
                    </div>
                </div>

                <div className={styles.field}>
                    <div className={styles.fieldName}>
                        <span>What do you need? (Optional)</span>
                    </div>
                    <div className={styles.fieldBody}>
                        <div className={styles.fieldInput}>
                            <input placeholder={"CRN"} type={"text"}/>
                        </div>
                    </div>
                </div>

                <div className={styles.foundCRNWrapper}>
                    <div className={styles.crnTitle}>
                        <span>Course Details</span>
                    </div>
                    <div className={styles.foundCRN}>
                        <div>
                            <span className={styles.courseTag}>ACCT111</span>
                            <span> Principles of Financial Acct</span>
                        </div>
                        <div className={styles.courseInstructor}>
                            <span>Abouelsood, Heba</span>
                        </div>
                        <div className={styles.courseTime}>
                            <span>M/W 12:30-13:45</span>
                        </div>
                    </div>
                </div>

                <div className={styles.field}>
                    <div className={styles.fieldName}>
                        <span>Email</span>
                    </div>
                    <div className={styles.fieldInput}>
                        <input placeholder={"Email"} type={"email"} required/>
                    </div>
                    <div className={styles.fieldAbout}>
                        <span>Your email will not be shown. We will send you an email when someone wants to swap.</span>
                    </div>
                </div>


                <div className={styles.submitButton}>
                    <div className={styles.submitButtonWrapper}>
                        <div title={"Submit"}
                             onClick={submit}
                             className={submitting ? styles.veryDisabledFormSubmit : formFilled() ? styles.enabledFormSubmit : styles.disabledFormSubmit}>
                            <span>Submit</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className={styles.swapList}>
                        <div className={styles.swapListTitle}>
                            <span>Recent submissions</span>
                        </div>
                    </div>

                </div>


            </div>
        </>
    )
}