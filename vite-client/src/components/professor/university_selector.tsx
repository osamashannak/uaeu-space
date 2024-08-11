import styles from "../../styles/pages/professor.module.scss";
import {useContext} from "react";
import {UniversityContext} from "../../pages/professor_lookup.tsx";
import uos from "../../assets/images/university/uos.png";
import uaeu from "../../assets/images/university/uaeu.png";

export default function UniversitySelector() {

    const {university, setUniversity} = useContext(UniversityContext);

    return (
        <div className={styles.pickUniversityParent}>
            <div className={styles.pickUniversityText}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                    <rect width="24" height="24" fill="none"/>
                    <path fill="currentColor"
                          d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9zm6.82 6L12 12.72L5.18 9L12 5.28zM17 16l-5 2.72L7 16v-3.73L12 15l5-2.73z"/>
                </svg>
                <span>Select your university</span>
            </div>
            <div className={styles.pickUniversity}>

                <div
                    onClick={() => setUniversity('United Arab Emirates University')}
                    className={university === 'United Arab Emirates University' ? styles.selected : styles.university}>
                    <img src={uaeu} alt="uaeu"/>
                <span>United Arab Emirates University</span>
                </div>

                {/*<div
                    onClick={() => setUniversity('Khalifa University')}
                    className={university === 'Khalifa University' ? styles.selected : styles.university}>
                    <span>Khalifa University</span>
                </div>*/}

                <div
                    onClick={() => setUniversity('University of Sharjah')}
                    className={university === 'University of Sharjah' ? styles.selected : styles.university}>
                    <img src={uos} alt="uos"/>
                    <span>University of Sharjah</span>
                </div>

            </div>
        </div>
    )

}