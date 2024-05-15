import Layout from "../layouts/layout.tsx";
import styles from "../styles/pages/home.module.scss";
import {useNavigate} from "react-router-dom";
import writingPuppy from "../assets/images/writing_puppy.gif";
import FilteredReviews from "../components/filtered_reviews.tsx";

export default function Root() {

    const navigate = useNavigate();


    return (
        <div>

            <div className={styles.head}>
                <div>
                    <div className={styles.title}>
                        <span>We now support more universities!</span>
                    </div>
                    <div className={styles.universityList}>
                        <div className={styles.universityName}>
                            <span>• Khalifa University</span>
                        </div>

                        <div className={styles.universityName}>
                            <span>• University of Sharjah</span>
                        </div>

                        <div className={styles.moreComingSoon}>
                            <span>More universities coming soon!</span>
                        </div>

                    </div>

                </div>

            </div>

            <div className={styles.gotoBlock}>

                <div className={styles.gotoButton} onClick={() => {
                    navigate("/professor")
                }}>
                    <span>Rate a Professor</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
                        <path fill="currentColor"
                              d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"/>
                    </svg>
                </div>

                <div className={styles.gotoButton} onClick={() => {
                    navigate("/course")
                }}>
                    <span>Course Materials</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
                        <path fill="currentColor"
                              d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"/>
                    </svg>
                </div>
            </div>

            <FilteredReviews/>
        </div>
    )
}