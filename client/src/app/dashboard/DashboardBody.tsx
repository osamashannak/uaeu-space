"use client";

import styles from "@/styles/Dashboard.module.scss";
import SearchBox from "@/components/Dashboard/SearchBox";
import PendingReviews from "@/components/Dashboard/PendingReviews";
import PendingFiles from "@/components/Dashboard/PendingFiles";
import {useState} from "react";


const DashboardBody = () => {
    const [professor, setProfessor] = useState<string | null>(null);
    const [course, setCourse] = useState<string | null>(null);

    return (
        <div className={styles.dashboardBody}>
            <section className={styles.section}>
                <h2>Pending Professor Reviews</h2>
                <div>
                    <span>Search for professor: &nbsp;</span>
                    <SearchBox type={"professor"} setState={setProfessor}/>
                    <div className={styles.resetButton} onClick={() => setProfessor(null)}>Reset</div>
                </div>
                <div className={styles.sectionBody}>
                    <PendingReviews professor={professor}/>
                </div>
            </section>

            <section className={styles.section}>
                <h2>Pending Course Files</h2>
                <div>
                    <span>Search for course: &nbsp;</span>
                    <SearchBox type={"course"} setState={setCourse}/>
                    <div className={styles.resetButton} onClick={() => setCourse(null)}>Reset</div>
                </div>
                <div className={styles.sectionBody}>
                    <PendingFiles course={course}/>
                </div>
            </section>
        </div>
    )
}

export default DashboardBody;