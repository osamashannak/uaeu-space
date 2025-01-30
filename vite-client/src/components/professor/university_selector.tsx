import styles from "../../styles/pages/professor.module.scss";
import {useContext} from "react";
import {UniversityContext} from "../../pages/professor_lookup.tsx";
import uos from "../../assets/images/university/uos.png";
import uaeu from "../../assets/images/university/uaeu.png";
import ku from "../../assets/images/university/ku.png";

export default function UniversitySelector() {

    const {university, setUniversity} = useContext(UniversityContext);

    return (
        <div className={styles.pickUniversityParent}>
            <div className={styles.pickUniversityText}>
                <span>Select university</span>
            </div>
            <div className={styles.pickUniversity}>

                <div
                    onClick={() => setUniversity('United Arab Emirates University')}
                    className={university === 'United Arab Emirates University' ? styles.selected : styles.university}>
                    <img src={uaeu} alt="uaeu"/>
                    <div className={styles.uniName}>
                        <span>UAEU</span>
                    </div>
                </div>

                <div
                    onClick={() => setUniversity('Khalifa University')}
                    className={university === 'Khalifa University' ? styles.selected : styles.university}>
                    <img src={ku} alt="ku"/>
                    <div className={styles.uniName}>
                        <span>KU</span>
                    </div>
                </div>

                <div
                    onClick={() => setUniversity('University of Sharjah')}
                    className={university === 'University of Sharjah' ? styles.selected : styles.university}>
                    <img src={uos} alt="uos"/>
                    <div className={styles.uniName}>
                        <span>UOS</span>
                    </div>
                </div>

            </div>
        </div>
    )

}