import Layout from "../layouts/layout.tsx";
import styles from "../styles/pages/home.module.scss";

export default function Root() {


    return (
        <Layout>
            <div style={{padding: "0 12px 0"}}>
                {/*<ResponsiveAdUnit slotId={4492620959}/>*/}

                {/*<div className={styles.helpusWrapper}>
                    <div className={styles.helpUs}>
                        <span>💙</span>
                        <p>Uploading materials and rating professors will help students like you succeed in the
                            university.</p>
                    </div>
                </div>*/}

                <div className={styles.announcement}>
                    <h3>UAEU Space is now <span className={styles.title}>SpaceRead.net</span><span
                        className={styles.confettiEmoji}>🎉</span></h3>
                </div>
                {/*<h3 className={styles.phrase}>It&apos;s time to transform your academic journey.</h3>*/}


                {/*<div className={styles.adCover}>
                <Image onClick={adClick} className={styles.adImage1} src={"/ad/ad.jpeg"} alt={""} width={800}
                       height={100}/>
                <Image onClick={adClick} className={styles.adImage2} src={"/ad/adPhone.jpeg"} alt={""} width={300}
                       height={100}/>
            </div>*/}
            </div>
        </Layout>
    )
}