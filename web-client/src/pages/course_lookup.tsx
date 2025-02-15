import SearchBox from "../components/searchbox.tsx";
import styles from "../styles/pages/course.module.scss";
import {Helmet} from "react-helmet-async";

export default function CourseLookup() {
    return (
        <>
            <Helmet>
                <title>Course Materials - SpaceRead</title>
            </Helmet>
            <div className={styles.searchPage}>
                <div className={styles.title}>
                    <span>Course Materials</span>
                </div>
                <div className={styles.about}>
                    <span>Share and find materials for your courses <span className={styles.uaeuOnly}>(for UAEU)</span></span>
                </div>

                <div className={styles.featureList}>

                    <div className={styles.listItem}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16">
                            <g fill="currentColor">
                                <path
                                    d="M9.669.864L8 0L6.331.864l-1.858.282l-.842 1.68l-1.337 1.32L2.6 6l-.306 1.854l1.337 1.32l.842 1.68l1.858.282L8 12l1.669-.864l1.858-.282l.842-1.68l1.337-1.32L13.4 6l.306-1.854l-1.337-1.32l-.842-1.68zm1.196 1.193l.684 1.365l1.086 1.072L12.387 6l.248 1.506l-1.086 1.072l-.684 1.365l-1.51.229L8 10.874l-1.355-.702l-1.51-.229l-.684-1.365l-1.086-1.072L3.614 6l-.25-1.506l1.087-1.072l.684-1.365l1.51-.229L8 1.126l1.356.702z"/>
                                <path d="M4 11.794V16l4-1l4 1v-4.206l-2.018.306L8 13.126L6.018 12.1z"/>
                            </g>
                        </svg>
                        <span>Be the reason for the success of many students</span>
                    </div>

                    <div className={styles.listItem}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/>
                        </svg>
                        <span>Download notes, videos, presentations and more</span>
                    </div>
                </div>

                <div className={styles.searchBox}>
                    <SearchBox type={"course"}/>

                </div>
            </div>
        </>
    )
}