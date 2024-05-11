import styles from "../../styles/pages/professor.module.scss";
import {useContext} from "react";
import {UniversityContext} from "../../pages/professor_lookup.tsx";


export default function UniversitySelector() {

    const {university, setUniversity} = useContext(UniversityContext);

    return (
        <div className={styles.pickUniversityParent}>
            <div className={styles.pickUniversityText}>
                <span>Select your university</span>
            </div>
            <div className={styles.pickUniversity}>

                <div
                    onClick={() => setUniversity('United Arab Emirates University')}
                    className={university === 'United Arab Emirates University' ? styles.selected : styles.university}>
                    <span>United Arab Emirates University</span>
                </div>

                <div
                    onClick={() => setUniversity('Khalifa University')}
                    className={university === 'Khalifa University' ? styles.selected : styles.university}>
                    <span>Khalifa University</span>
                </div>

                {/*<div
                    onClick={() => setUniversity('University of Sharjah')}
                    className={university === 'University of Sharjah' ? styles.selected : styles.university}>
                    <span>University of Sharjah</span>
                </div>*/}

            </div>
        </div>
    )

}