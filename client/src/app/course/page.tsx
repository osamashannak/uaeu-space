import SearchBox from "@/components/SearchBox";
import styles from "@/styles/Course.module.scss";

const Course = () => {
    return (
        <div className={styles.searchPage}>
            <h1>Course</h1>
            <p>Share and find materials you need to help you succeed in your courses</p>

            <div className={styles.searchBox}>
                <SearchBox type={"course"}/>
            </div>
        </div>
    )
}

export default Course;