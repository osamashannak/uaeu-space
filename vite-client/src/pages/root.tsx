import Layout from "../layouts/layout.tsx";
import styles from "../styles/pages/home.module.scss";
import {useNavigate} from "react-router-dom";
import writingPuppy from "../assets/images/writing_puppy.gif";

export default function Root() {

    const navigate = useNavigate();


    return (
        <Layout>

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

                <img className={styles.writingPuppy} src={writingPuppy} alt={"Writing puppy"}/>

            </div>

            <div className={styles.callToAction}>
                <div>
                    <span> Post your reviews now!</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="100" style={{rotate: "180deg"}}
                     viewBox="0 0 100 125" x="0px"
                     y="0px">
                    <path
                        d="M50.87057,12.48878c-1.44117,1.48722-2.604,2.80073-3.92916,3.92248-0.18189.154-1.17082-.64549-1.47517-0.82256,2.06429-4.38688,3.94736-8.54312,6.01437-12.60573a2.53391,2.53391,0,0,1,2.18312-.92268c0.843,0.63468,1.98873,1.88564,1.83518,2.654-0.78182,3.91164.41236,7.44615,1.46492,11.062a13.75986,13.75986,0,0,1,.4956,3.76528,3.79887,3.79887,0,0,1-.96034,1.52494A4.947,4.947,0,0,1,55.45,19.60664c-0.61681-2.54285-1.11673-5.11406-1.65839-7.67515l-0.59719-.03123c-0.7969,3.54875-1.62472,7.09087-2.38416,10.6476-1.48991,6.97787-3.02917,13.94711-4.37033,20.954a73.08941,73.08941,0,0,0-1.13527,9.79627c-0.07551,1.40537.5889,2.85052,0.93795,4.36809,1.90089-.36944,3.42089-0.7018,4.95392-0.95546,3.746-.61988,7.82226,2.91232,7.74534,6.68167-0.06315,3.09291-4.51138,5.65691-7.54463,4.10143-1.94531-.99758-3.59184-2.57774-5.76392-4.18684a31.14015,31.14015,0,0,0-1.69292,4.86524c-1.07885,5.87272.60927,11.369,2.83986,16.68134a75.442,75.442,0,0,0,4.62887,8.98932c0.54132,0.91946,1.84012,1.38677,2.776,2.08292,0.47648,0.35439.91683,0.7573,1.3735,1.13829-0.66935.32557-1.6291,1.10933-1.95941,0.9-1.73559-1.1-3.8611-2.1231-4.84673-3.773a55.77178,55.77178,0,0,1-7.593-20.86346c-0.43835-3.14955.60434-6.716,1.75-9.80514,0.83924-2.2629,1.33775-4.03013.641-6.49653a19.59324,19.59324,0,0,1-.32291-7.98215c0.98145-6.61015,2.23627-13.18688,3.606-19.73C48.00029,23.74049,49.47951,18.23253,50.87057,12.48878ZM51.4515,58.99391l-3.47479,1.55495a43.84818,43.84818,0,0,0,2.48142,3.82275,4.02763,4.02763,0,0,0,1.9302,1.08539,2.88419,2.88419,0,0,0,3.91893-3.10854C55.98643,60.663,53.765,58.90274,51.4515,58.99391Z"/>
                </svg>
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
        </Layout>
    )
}