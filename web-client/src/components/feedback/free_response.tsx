import {Question} from "../../typed/feedback.ts";
import styles from "../../styles/pages/feedback.module.scss";


export default function FreeResponse({ question, onChange } : {
    question: Question,
    onChange: (value: string) => void
}) {

    return (
        <div className={styles.questionBox}>
            <div className={styles.question}>
                <span>{question.text}</span>
            </div>
            <div className={styles.answerField}>
                <textarea
                    className={styles.freeInput}
                    name={question.text}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Type your answer here..."
                />
            </div>
        </div>
    )
}