import styles from "../styles/pages/home.module.scss";
import {useState} from "react";


export default function FilteredReviews() {

    const [selected, setSelected] = useState("rated");

    return (
        <div>
            <div className={styles.filterButtons}>
                <div className={selected === "rated" ? styles.selected : styles.button} onClick={() => setSelected("rated")}>
                    <span>Rated</span>
                </div>

                <div className={selected === "my" ? styles.selected : styles.button} onClick={() => setSelected("my")}>
                    <span>My Reviews</span>
                </div>
            </div>

            <div className={styles.filterList}>
                <span className={styles.emptyText}>Nothing to see here.</span>
            </div>
        </div>
    )
}