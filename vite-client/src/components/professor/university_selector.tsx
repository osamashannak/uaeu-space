import styles from "../../styles/pages/professor.module.scss";
import {useContext} from "react";
import {UniversityContext} from "../../pages/professor_lookup.tsx";
import uos from "../../assets/images/university/uos.png";
import uaeu from "../../assets/images/university/uaeu.png";
import zu from "../../assets/images/university/zu.png";

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
                    <img src={uaeu} alt="uaeu"/>
                <span>United Arab Emirates University</span>
                </div>

                {/*<div
                    onClick={() => setUniversity('Zayed University')}
                    className={university === 'Zayed University' ? styles.selected : styles.university}>
                    <img src={zu} alt="uaeu"/>
                    <span>Zayed University</span>
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