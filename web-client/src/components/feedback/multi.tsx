import {Question} from "../../typed/feedback.ts";
import styles from "../../styles/pages/feedback.module.scss";
import {Dispatch, SetStateAction, useState} from "react";


export default function Multi({ question, onChange } : {
    question: Question,
    onChange: Dispatch<SetStateAction<string | null>>
}) {

    const [selected, setSelected] = useState<string[]>([]);

    const handleToggle = (option: string) => {
        let updated: string[];
        if (selected.includes(option)) {
            updated = selected.filter((v) => v !== option);
        } else {
            updated = [...selected, option];
        }
        setSelected(updated);
        onChange(JSON.stringify(updated));
    };


    return (
        <div className={styles.questionBox}>
            <div className={styles.question}>
                <span>{question.text}</span>
            </div>
            <div className={styles.answerField}>
                {question.options?.map((option, index) => (
                    <label htmlFor={`${option}-${index}`} className={styles.checkBox} key={index}>
                        <input type="checkbox"
                               id={`${option}-${index}`}
                               className={styles.inputBox}
                               name={question.text}
                               checked={selected.includes(option)}
                               onChange={() => handleToggle(option)}
                               value={option}/>
                        <div className={styles.checkBoxSquare}>
                            <div className={styles.squareBackground}/>
                        </div>
                        <span className={styles.labelText}>{option}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}