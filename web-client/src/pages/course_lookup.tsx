import SearchBox from "../components/searchbox.tsx";
import styles from "../styles/pages/course.module.scss";
import {Helmet} from "@dr.pogodin/react-helmet";

export default function CourseLookup() {
    return (
        <>
            <Helmet>
                <title>Course Materials - SpaceRead</title>
            </Helmet>
            <div className={styles.searchPage}>
                <section className={styles.lookupHero}>
                    <div className={styles.heroCopy}>
                        <span className={styles.heroEyebrow}>Course materials</span>
                        <h1>Course Materials</h1>
                        <p>Share and find notes, slides, videos, and files for UAEU courses.</p>
                    </div>
                </section>

                <section className={styles.lookupPanel}>
                    <div className={styles.searchBox}>
                        <SearchBox
                            type={"course"}
                            placeholder={"Search by course code or name"}
                        />
                    </div>
                </section>
            </div>
        </>
    )
}
