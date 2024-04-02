import styles from "../styles/pages/professor.module.scss";
import Layout from "../layouts/layout.tsx";
import SearchBox from "../components/searchbox.tsx";


export default function ProfessorLookup() {

    return (
        <Layout>
            <div className={styles.searchPage}>
                <h1>Rate a Professor</h1>
                <span>Learn about your professors from other students and rate their performance</span>

                <div className={styles.searchBox}>
                    <SearchBox type={"professor"}/>
                    <div className={styles.caution}>
                        <p className={styles.caution}>Can't find your professor? DM us on <a href={"https://instagram.com/uaeu.space"}>Instagram</a></p>
                    </div>
                </div>

            </div>

        </Layout>
    )

}