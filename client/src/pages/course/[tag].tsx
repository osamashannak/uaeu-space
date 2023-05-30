import styles from "@/styles/Course.module.scss";
import fileStyles from "@/styles/components/File.module.scss";
import Head from 'next/head';
import {CourseAPI} from "@/interface/course";
import {getCourse} from "@/api/course";
import {GetServerSidePropsContext} from "next";
import {ResponsiveAdUnit} from "@/components/ResponsiveAdUnit";
import {MultiplexAd} from "@/components/MultiplexAd";
import File from "@/components/Course/File";
import FileUpload from "@/components/Course/FileUpload";

const Course = (props: CourseAPI) => {

    let files = props.files.length > 0 ? [...props.files].sort((a, b) => b.name.length - a.name.length).slice(0, 3).map((value) => value.name) : [];
    let filesString = files.length > 0 ? `Download ${files.join(", ")}` : "";

    const fileCount = props.files.length;

    return (
        <>
            <Head>
                <title>{`${props.name} - UAE University - UAEU Space`}</title>
                <meta name="description"
                      content={filesString || `Find and upload materials for ${props.tag} to help other students at UAEU.`}/>
                <link rel="canonical" href={`https://uaeu.space/course/${props.tag}`}/>
                <meta property="og:title" content={`${props.name} - UAEU Space`}/>
                <meta property="og:description"
                      content={filesString || `Find and upload materials for ${props.tag} to help other students at UAEU.`}/>
                <meta property="og:url" content={`https://uaeu.space/course/${props.tag}`}/>
            </Head>

            <div className={styles.coursePage}>
                <section className={styles.courseInfoHead}>
                    <h2>{props.tag}</h2>
                    <h1>{props.name}</h1>
                </section>

                <ResponsiveAdUnit slotId={8903184422}/>

                <section className={styles.fileList}>
                    {
                        fileCount > 0 ? props.files.map((value, index) => (
                            <>
                                <File key={index} {...value}/>
                                {Math.floor(fileCount / 2) === index &&
                                    <ResponsiveAdUnit slotId={1529404516}/>
                                }
                            </>
                        )) : <p className={fileStyles.file}>{"There are no files."}</p>
                    }
                </section>

                <ResponsiveAdUnit slotId={3842429430}/>

                <section>
                    <FileUpload courseTag={props.tag}/>
                </section>
                
                <MultiplexAd slotId={6339480708} style={{marginTop: "1rem"}}/>
            </div>
        </>
    );
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const {tag} = context.query;
    const data = await getCourse(tag as string);

    if (data == undefined) {
        return {
            redirect: {
                destination: '/404',
            }
        }
    }

    return {
        props: data
    }
}

export default Course;