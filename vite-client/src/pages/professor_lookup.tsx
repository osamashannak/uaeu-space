import styles from "../styles/pages/professor.module.scss";
import Layout from "../layouts/layout.tsx";
import SearchBox from "../components/searchbox.tsx";


export default function ProfessorLookup() {

    return (
        <Layout>
            <div className={styles.searchPage}>
                <h1>Rate a Professor</h1>
                <p>Learn about your professors from other students and rate their performance</p>

                <div className={styles.searchBox}>
                    <SearchBox type={"professor"}/>
                </div>


            </div>
        </Layout>
    )

}