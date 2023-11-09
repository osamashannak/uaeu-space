import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import Image from "next/image";
import SearchBox from "@/components/SearchBox";
import Link from "next/link";
import {ResponsiveAdUnit} from "@/components/ResponsiveAdUnit";
import {useRouter} from "next/router";

const Home = () => {

    const router = useRouter();

    const adClick = () => {
        window.open("https://api.uaeu.space/advertisement", "_blank");
    }

    return (
        <>
            <Head>
                <title>UAEU Space - Share Course Materials and Rate Professors</title>
                <meta property="og:title" content="UAEU Space"/>
                <meta property="og:description"
                      content="UAEU Space is a multi-purpose platform for UAEU students to prepare them during their studies. You can find and share materials for courses that are taken by the university's students."/>
                <meta property="og:url" content="https://uaeu.space"/>
            </Head>

            {/*<ResponsiveAdUnit slotId={4492620959}/>*/}

            {/*<section className={styles.helpUs}>
                <span>💙</span>
                <p>Uploading materials and rating professors will help students like you succeed in the university.</p>
            </section>*/}


            <h3 className={styles.phrase}>It's time to transform your academic journey.</h3>

            <div className={styles.boxList}>

                <div className={styles.box}
                     onClick={() => {
                         router.push("/course");
                     }}>
                    <div>
                        <div className={styles.boxImage}>
                            <Image
                                src={"/homepage/course.png"}
                                alt={""}
                                width={300}
                                height={300}/>
                        </div>
                        <div className={styles.boxTitle}>
                            <span>Course Materials</span>
                        </div>
                    </div>
                </div>

                <div className={styles.box}
                     onClick={() => {
                         router.push("/professor");
                     }}>
                    <div>
                        <div className={styles.boxImage}>
                            <Image
                                src={"/homepage/professor.png"}
                                alt={""}
                                width={300}
                                height={300}/>
                        </div>
                        <div className={styles.boxTitle}>
                            <span>Rate Professor</span>
                        </div>
                    </div>
                </div>
            </div>


            {/*<div className={styles.adCover}>
                <Image onClick={adClick} className={styles.adImage1} src={"/ad/ad.jpeg"} alt={""} width={800}
                       height={100}/>
                <Image onClick={adClick} className={styles.adImage2} src={"/ad/adPhone.jpeg"} alt={""} width={300}
                       height={100}/>
            </div>*/}
        </>
    )
}

export default Home;