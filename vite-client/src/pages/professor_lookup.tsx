import styles from "../styles/pages/professor.module.scss";
import SearchBox from "../components/searchbox.tsx";
import UniversitySelector from "../components/professor/university_selector.tsx";
import {createContext, useEffect, useState} from "react";
import {ProfessorHistory} from "../typed/professor.ts";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {Helmet} from "react-helmet-async";

dayjs.extend(relativeTime);

export type GlobalContent = {
    university: string | null,
    setUniversity: (c: string) => void
}
export const UniversityContext = createContext<GlobalContent>({
    setUniversity(c: string): void {
    }, university: null
});

export default function ProfessorLookup() {

    const selectedUniversity = localStorage.getItem('selectedUniversity');

    const [university, setUniversity] = useState(selectedUniversity);

    useEffect(() => {
        if (!university) return;

        localStorage.setItem('selectedUniversity', university);
    }, [university]);

    const professorHistory = JSON.parse(localStorage.getItem('professorHistory') || '[]') as ProfessorHistory[];

    return (
        <>
            <Helmet>
                <title>Rate a Professor - SpaceRead</title>
            </Helmet>
            <div className={styles.searchPage}>
                <div className={styles.searchPageHead}>
                    <div className={styles.title}>
                        <span>Rate a Professor </span>
                    </div>
                    <span className={styles.about}>Take advice from other students and share yours</span>

                </div>

                <div className={styles.featureList}>

                    <div className={styles.listItem}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M21 11c0 5.55-3.84 10.74-9 12c-5.16-1.26-9-6.45-9-12V5l9-4l9 4zm-9 10c3.75-1 7-5.46 7-9.78V6.3l-7-3.12L5 6.3v4.92C5 15.54 8.25 20 12 21"/>
                        </svg>
                        <span>Your reviews are 100% anonymous</span>
                    </div>

                    <div className={styles.listItem}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                        <path fill="currentColor"
                                  d="m14.06 9l.94.94L5.92 19H5v-.92zm3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"/>
                        </svg>
                        <span>Delete your reviews whenever</span>
                    </div>
                </div>


                <UniversityContext.Provider value={{university, setUniversity}}>
                    <UniversitySelector/>

                    {university && <div className={styles.searchBox}>
                        <div className={styles.caution}>
                            <p className={styles.caution}>Can't find your professor? DM us on <a
                                href={"https://instagram.com/uaeu.space"}>Instagram</a></p>
                        </div>
                        <SearchBox type={"professor"}/>
                    </div>}
                </UniversityContext.Provider>


                {/*{professorHistory.length > 0 && <div className={styles.prevProfs}>
                    <div className={styles.historyTitle}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                             viewBox="0 0 24 24">
                            <rect width="24" height="24" fill="none"/>
                            <path fill="currentColor"
                                  d="M12 21q-3.45 0-6.012-2.287T3.05 13H5.1q.35 2.6 2.313 4.3T12 19q2.925 0 4.963-2.037T19 12t-2.037-4.962T12 5q-1.725 0-3.225.8T6.25 8H9v2H3V4h2v2.35q1.275-1.6 3.113-2.475T12 3q1.875 0 3.513.713t2.85 1.924t1.925 2.85T21 12t-.712 3.513t-1.925 2.85t-2.85 1.925T12 21m2.8-4.8L11 12.4V7h2v4.6l3.2 3.2z"/>
                        </svg>
                        <span>Visit history</span>
                    </div>
                    {
                        professorHistory.slice(0, 5).map((professor, index) => (
                            <div key={index} className={styles.professorCard}>
                                <div className={styles.time}>
                                    <span>•</span>
                                    <span
                                        title={dayjs(professor.date).format("MMM D, YYYY h:mm A")}>{dayjs(professor.date).fromNow()}</span>
                                </div>
                                <div className={styles.professorInfo}>
                                    <Link className={styles.profName}
                                          to={`/professor/${professor.email}`}>{professor.name}</Link>
                                    <div className={styles.profUniversityParent}>
                                        <span className={styles.profUniversity}>{professor.university}</span>
                                    </div>
                                </div>
                            </div>
                        ))

                    }

                </div>}*/}

            </div>

        </>
    )

}