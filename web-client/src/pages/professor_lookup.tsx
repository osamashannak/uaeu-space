import styles from "../styles/pages/professor.module.scss";
import SearchBox from "../components/searchbox.tsx";
import UniversitySelector from "../components/professor/university_selector.tsx";
import {createContext, useEffect, useState} from "react";
import {Helmet} from "@dr.pogodin/react-helmet";

export type GlobalContent = {
    university: string | null,
    setUniversity: (c: string) => void
}
export const UniversityContext = createContext<GlobalContent>({
    setUniversity(_c: string): void {
    }, university: null
});

const universityShortNames: Record<string, string> = {
    "United Arab Emirates University": "UAEU",
    "Khalifa University": "KU",
    "University of Sharjah": "UOS",
};

export default function ProfessorLookup() {

    const selectedUniversity = localStorage.getItem("selectedUniversity");

    const [university, setUniversity] = useState(selectedUniversity);
    const [showProfessorHelp, setShowProfessorHelp] = useState(false);

    useEffect(() => {
        if (!university) return;

        localStorage.setItem("selectedUniversity", university);
    }, [university]);

    return (
        <>
            <Helmet>
                <title>Rate a Professor - SpaceRead</title>
            </Helmet>
            <div className={styles.searchPage}>
                <section className={styles.lookupHero}>
                    <div className={styles.heroCopy}>
                        <span className={styles.heroEyebrow}>Professor reviews</span>
                        <h1>Rate a Professor</h1>
                        <p>Find student experiences before registration, then leave yours after class.</p>
                    </div>
                    <div className={styles.heroSignals} aria-label="Professor review highlights">
                        <div className={styles.heroSignal}>
                            <strong>30k+</strong>
                            <span>reviews posted</span>
                        </div>
                        <div className={styles.heroSignal}>
                            <strong>Anonymous</strong>
                            <span>reviews</span>
                        </div>
                        <div className={styles.heroSignal}>
                            <strong>3</strong>
                            <span>universities</span>
                        </div>
                    </div>
                </section>

                <section className={styles.lookupPanel}>
                    <UniversityContext.Provider value={{university, setUniversity}}>
                        <UniversitySelector/>

                        <div className={styles.searchBox}>
                            <div className={styles.searchStepHeader}>
                                <span className={styles.stepBadge}>2</span>
                                <div>
                                    <span>Search professors</span>
                                    <p>{university ? `${universityShortNames[university] ?? university} is selected.` : "Select a university first."}</p>
                                </div>
                            </div>

                            {university ? (
                                <>
                                    <div
                                        onFocus={() => setShowProfessorHelp(true)}
                                        onChange={() => setShowProfessorHelp(true)}>
                                        <SearchBox
                                            type={"professor"}
                                            placeholder={"Search by professor name or email"}
                                        />
                                    </div>
                                    {showProfessorHelp && (
                                        <p className={styles.caution}>Can't find your professor? DM us on <a
                                            href={"https://instagram.com/uaeu.space"}>Instagram</a></p>
                                    )}
                                </>
                            ) : (
                                <div className={styles.emptySearchState}>
                                    <span>Pick a university to load its professor list.</span>
                                </div>
                            )}
                        </div>
                    </UniversityContext.Provider>
                </section>
            </div>
        </>
    )
}
