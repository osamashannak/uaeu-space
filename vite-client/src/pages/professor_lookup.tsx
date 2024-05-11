import styles from "../styles/pages/professor.module.scss";
import Layout from "../layouts/layout.tsx";
import SearchBox from "../components/searchbox.tsx";
import UniversitySelector from "../components/professor/university_selector.tsx";
import {createContext, useEffect, useState} from "react";
import {ProfessorHistory} from "../typed/professor.ts";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export type GlobalContent = {
    university: string
    setUniversity: (c: string) => void
}
export const UniversityContext = createContext<GlobalContent>({
    setUniversity(c: string): void {
    }, university: ""
});

export default function ProfessorLookup() {

    const selectedUniversity = localStorage.getItem('selectedUniversity') || 'United Arab Emirates University';

    const [university, setUniversity] = useState(selectedUniversity);

    useEffect(() => {
        localStorage.setItem('selectedUniversity', university);
    }, [university]);

    const professorHistory = JSON.parse(localStorage.getItem('professorHistory') || '[]') as ProfessorHistory[];

    return (
        <Layout>
            <div className={styles.searchPage}>
                <div className={styles.title}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 20 20">
                        <path fill="currentColor"
                              d="M12.159 2.974a.5.5 0 1 0-.317-.948c-.937.312-1.522 1.082-1.866 1.907a5 5 0 0 0-.127.339a4 4 0 0 0-.711-.963a4 4 0 0 0-2.94-1.17c-.58.016-1.043.48-1.059 1.059a4 4 0 0 0 1.17 2.94l.031.03A4 4 0 0 0 3.198 9.76l-.006.074a8.5 8.5 0 0 0 1.01 4.748l.36.658q.014.026.032.05l1 1.402a2.685 2.685 0 0 0 4.084.338a.456.456 0 0 1 .645 0a2.685 2.685 0 0 0 4.084-.338l1-1.401l.032-.051l.359-.658a8.5 8.5 0 0 0 1.01-4.748l-.005-.074a4 4 0 0 0-4.645-3.626l-1.657.276c.01-.681.13-1.447.399-2.093c.28-.675.696-1.155 1.258-1.343m-5.25 6a1.22 1.22 0 0 0-.717.605c-.185.348-.312.922-.195 1.859a.5.5 0 0 1-.992.124c-.133-1.064-.01-1.865.305-2.454c.32-.6.807-.924 1.283-1.083a.5.5 0 0 1 .316.949"/>
                    </svg>
                    <span>Rate a Professor</span>
                </div>
                <span className={styles.about}>Take advice from other students and share yours</span>


                <UniversityContext.Provider value={{university, setUniversity}}>
                    <UniversitySelector/>

                    <div className={styles.searchBox}>
                        <div className={styles.caution}>
                            <p className={styles.caution}>Can't find your professor? DM us on <a
                                href={"https://instagram.com/uaeu.space"}>Instagram</a></p>
                        </div>
                        <SearchBox type={"professor"}/>
                    </div>
                </UniversityContext.Provider>

            </div>


            {professorHistory.length > 0 && <div className={styles.prevProfs}>
                <div className={styles.historyTitle}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                         viewBox="0 0 24 24">
                        <rect width="24" height="24" fill="none"/>
                        <path fill="currentColor"
                              d="M12 21q-3.45 0-6.012-2.287T3.05 13H5.1q.35 2.6 2.313 4.3T12 19q2.925 0 4.963-2.037T19 12t-2.037-4.962T12 5q-1.725 0-3.225.8T6.25 8H9v2H3V4h2v2.35q1.275-1.6 3.113-2.475T12 3q1.875 0 3.513.713t2.85 1.924t1.925 2.85T21 12t-.712 3.513t-1.925 2.85t-2.85 1.925T12 21m2.8-4.8L11 12.4V7h2v4.6l3.2 3.2z"/>
                    </svg>
                    <span>Professor history</span>
                </div>
                {
                    professorHistory.slice(0, 5).map((professor, index) => (
                        <div key={index} className={styles.professorCard}>
                            <div className={styles.time}>
                                <span>•</span>
                                <span title={dayjs(professor.date).format("MMM D, YYYY h:mm A")}>{dayjs(professor.date).fromNow()}</span>
                            </div>
                            <div className={styles.professorInfo}>
                                <a className={styles.profName} href={`https://spaceread.net/professor/${professor.email}`}>{professor.name}</a>
                                <div className={styles.profUniversityParent}>
                                    <span className={styles.profUniversity}>{professor.university}</span>
                                </div>
                            </div>
                        </div>
                    ))

                }

            </div>}
        </Layout>
    )

}