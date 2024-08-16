import styles from "../../styles/pages/home.module.scss";
import {useState} from "react";


export default function FilteredPosts() {

    const [selected, setSelected] = useState("rated");

    return (
        <div>
            <div className={styles.filterButtons}>
                <div className={selected === "rated" ? styles.selected : styles.button} onClick={() => setSelected("rated")}>
                    <span>Recent Questions</span>
                </div>

                <div className={selected === "my" ? styles.selected : styles.button} onClick={() => setSelected("my")}>
                    <span>My Questions</span>
                </div>
            </div>

        </div>
    )
}