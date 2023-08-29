import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import Image from "next/image";
import SearchBox from "@/components/SearchBox";
import Link from "next/link";
import {ResponsiveAdUnit} from "@/components/ResponsiveAdUnit";

const Home = () => {

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

            <section className={styles.helpUs}>
                <span>💙</span>
                <p>Uploading materials and rating professors will help students like you succeed in the university.</p>
            </section>

            <section className={styles.course}>
                <h2>Study Materials</h2>
                <h3>Share and find materials you need to help you succeed in your courses</h3>
                <div className={styles.sectionBody}>
                    <SearchBox type={"course"}/>
                    <div className={styles.trending}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                      d="M3.4 18L2 16.6l7.4-7.45l4 4L18.6 8H16V6h6v6h-2V9.4L13.4 16l-4-4l-6 6Z"/>
                            </svg>
                            <h3>Most Uploads</h3>
                        </div>
                        <ul>
                            <li>
                                <Link href={"/course/STAT210"}>
                                    Probability and Statistics
                                </Link>
                            </li>
                            <li>
                                <Link href={"/course/GEIT112"}>
                                    Fourth Industrial Revolution
                                </Link>
                            </li>
                            <li>
                                <Link href={"/course/GESU121"}>
                                    Sustainability
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <Image src={"/girl-reading.png"}
                       className={styles.image}
                       alt={""}
                       priority
                       width={550}
                       height={500}/>
            </section>

            <hr className={styles.separator}/>

            {/*<ResponsiveAdUnit slotId={9919633065} style={{marginBottom: "1rem", marginTop: "0.5rem"}}/>*/}

            <section className={styles.professor}>
                <h2>Rate a Professor</h2>
                <h3>Learn about your professors from other students and rate their performance</h3>
                <div className={styles.sectionBody}>
                    <SearchBox type={"professor"}/>
                    <div className={styles.trending}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                      d="M3.4 18L2 16.6l7.4-7.45l4 4L18.6 8H16V6h6v6h-2V9.4L13.4 16l-4-4l-6 6Z"/>
                            </svg>
                            <h3>Trending Professors</h3>
                        </div>
                        <ul>
                            <li>
                                <Link href={"/professor/mohammed_m@uaeu.ac.ae"}>
                                    Dr. Mohammed Abuomar
                                </Link>
                            </li>
                            <li>
                                <Link href={"/professor/nqamhieh@uaeu.ac.ae"}>
                                    Dr. Naser Qamhieh
                                </Link>
                            </li>
                            <li>
                                <Link href={"/professor/f.alblooshi@uaeu.ac.ae"}>
                                    Dr. Fatima Alblooshi
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <Image src={"/professor-teaching.png"}
                       className={styles.image}
                       alt={""}
                       priority
                       width={776}
                       height={500}/>
            </section>
            <div className={styles.adCover}>
                <Image onClick={adClick} className={styles.adImage1} src={"/ad/ad.jpeg"} alt={""} width={800}
                       height={100}/>
                <Image onClick={adClick} className={styles.adImage2} src={"/ad/adPhone.jpeg"} alt={""} width={300}
                       height={100}/>
            </div>
        </>
    )
}

export default Home;