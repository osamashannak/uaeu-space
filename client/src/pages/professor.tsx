import SearchBox from "@/components/SearchBox";
import styles from "@/styles/Professor.module.scss";

const Professor = () => {
    return (
        <div className={styles.searchPage}>
            <h1>Rate a Professor</h1>
            <p>Learn about your professors from other students and rate their performance</p>

            <div className={styles.searchBox}>
                <SearchBox type={"professor"}/>
            </div>


        </div>
    )
}

export default Professor;