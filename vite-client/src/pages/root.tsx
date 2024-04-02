import Layout from "../layouts/layout.tsx";
import styles from "../styles/pages/home.module.scss";
import RamadanLantern from "../components/ramadan_lantern.tsx";
import SearchBox from "../components/searchbox.tsx";
import {useNavigate} from "react-router-dom";

export default function Root() {

    const navigate = useNavigate();


    return (
        <Layout>

            <div className={styles.head}>
                <div>
                    <div className={styles.title}><span>Ramadan Kareem 🌙</span></div>

                    <p>
                        Wishing you and your family a Ramadan mubarak with peace, joy, and prosperity
                    </p>


                </div>

                <RamadanLantern/>

            </div>


            <div className={styles.centerBlock}>

                <div className={styles.title}><span>Ramadan @ <span className={styles.redColor}>UAEU</span></span></div>

                <p>For a limited time, rate your favorite iftar menus in UAEU during Ramadan</p>

                <div className={styles.searchBox}>
                    <SearchBox type={"restaurant"}/>
                    <p className={styles.caution}>Something's missing? DM us on Instagram</p>
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
            {/*<ResponsiveAdUnit slotId={4492620959}/>*/}

            {/*<div className={styles.helpusWrapper}>
                    <div className={styles.helpUs}>
                        <span>💙</span>
                        <p>Uploading materials and rating professors will help students like you succeed in the
                            university.</p>
                    </div>
                </div>*/}
            {/*<h3 className={styles.phrase}>It&apos;s time to transform your academic journey.</h3>*/}


            {/*<div className={styles.adCover}>
                <Image onClick={adClick} className={styles.adImage1} src={"/ad/ad.jpeg"} alt={""} width={800}
                       height={100}/>
                <Image onClick={adClick} className={styles.adImage2} src={"/ad/adPhone.jpeg"} alt={""} width={300}
                       height={100}/>
            </div>*/}
        </Layout>
    )
}