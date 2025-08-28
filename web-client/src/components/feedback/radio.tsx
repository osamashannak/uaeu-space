import styles from "../../styles/pages/feedback.module.scss";
import {Question} from "../../typed/feedback.ts";
import {Dispatch, SetStateAction} from "react";


export default function Radio({question, answer, onChange}: {
    question: Question,
    answer: string | null,
    onChange: Dispatch<SetStateAction<string | null>>
}) {
    return (
        <div className={styles.questionBox}>
            <div className={styles.question}>
                <span>{question.text}</span>
            </div>
            <div className={styles.answerField}>
                {question.options?.map((option, index) => (
                    <label htmlFor={`${option}-${index}`} className={styles.radio} key={index}>
                        <input type="radio"
                               id={`${option}-${index}`}
                               className={styles.inputBox}
                               name={question.text}
                               onChange={() => onChange(option)}
                               checked={answer === option}
                               value={option}/>
                        <div className={styles.radioCircle}>
                            <div className={styles.circleBackground}/>
                        </div>
                        <span className={styles.labelText}>{option}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}