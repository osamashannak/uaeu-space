"use client";

import styles from '@/styles/Home.module.scss';
import Image from "next/image";
import {useRouter} from "next/navigation";
import Link from "next/link";

const Page = () => {

    const router = useRouter();

    const adClick = () => {
        window.open("https://api.uaeu.space/advertisement", "_blank");
    }

    return (
        <>

            {/*<ResponsiveAdUnit slotId={4492620959}/>*/}

            <div className={styles.helpusWrapper}>
                <div className={styles.helpUs}>
                    <span>💙</span>
                    <p>Uploading materials and rating professors will help students like you succeed in the
                        university.</p>
                </div>
            </div>

{/*
            <h3 className={styles.phrase}>It&apos;s time to transform your academic journey.</h3>*/}

            <div className={styles.trendingBox}>
                <h3 className={styles.trendingTitle}>Trending Professors</h3>



            </div>

            <div className={styles.boxList}>

                <div className={styles.box}
                     onClick={() => {
                         router.push("/course");
                     }}>
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

                <div className={styles.box}
                     onClick={() => {
                         router.push("/professor");
                     }}>
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

            <div>
                <h3>Try out the NEW <Link href={"gpa"}>GPA calculator</Link>!</h3>
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

export default Page;