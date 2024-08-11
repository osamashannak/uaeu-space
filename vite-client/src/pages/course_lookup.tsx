import SearchBox from "../components/searchbox.tsx";
import styles from "../styles/pages/course.module.scss";

export default function CourseLookup() {
    return (
        <div className={styles.searchPage}>
            <div className={styles.title}>
                <span>Course Materials</span>
            </div>
            <div className={styles.about}>
                <span>Share and find materials for your courses <span className={styles.uaeuOnly}>(for UAEU)</span></span>
            </div>

            <div className={styles.searchBox}>
                <SearchBox type={"course"}/>

            </div>
        </div>
    )
}