import styles from "@/styles/Course.module.scss";
import fileStyles from "@/styles/components/File.module.scss";
import Head from 'next/head';
import {getCourse} from "@/api/course";
import {ResponsiveAdUnit} from "@/components/ResponsiveAdUnit";
import File from "@/components/Course/File";
import FileUpload from "@/components/Course/FileUpload";
import {Metadata, ResolvingMetadata} from "next";


type Props = {
    params: { tag: string }
}

export async function generateMetadata(
    {params}: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

        const tag = params.tag;

        const props = await getCourse(tag);

        if (props == undefined) {
            return {
                robots: "noindex"
            }
        }

        const files = props.files.length > 0 ? [...props.files].sort((a, b) => b.name.length - a.name.length).slice(0, 3).map((value) => value.name) : [];
        const filesString = files.length > 0 ? `Download ${files.join(", ")}` : "";

        const fileCount = props.files.length;

        return {
            title: `${props.tag} - UAE University - UAEU Space`,
            description: filesString || `Find and upload materials for ${props.tag} to help other students at UAEU.`,
            alternates: {
                canonical: `https://uaeu.space/course/${props.tag}`,
            },
            openGraph: {
                title: `${props.name} - UAEU Space`,
                description: filesString || `Find and upload materials for ${props.tag} to help other students at UAEU.`,
                url: `https://uaeu.space/course/${props.tag}`,
            },
            robots: fileCount == 0 ? "noindex" : "index"
        }


}


const Course = async ({params}: { params: { tag: string } }) => {
    const data = await getCourse(params.tag as string);

    if (data == undefined) {
        return {
            redirect: {
                destination: '/404',
            }
        }
    }

    let files = data.files.length > 0 ? [...data.files].sort((a, b) => b.name.length - a.name.length).slice(0, 3).map((value) => value.name) : [];
    let filesString = files.length > 0 ? `Download ${files.join(", ")}` : "";

    const fileCount = data.files.length;

    return (
        <>
            <Head>
                <title>{`${data.name} - UAE University - UAEU Space`}</title>
                <meta name="description"
                      content={filesString || `Find and upload materials for ${data.tag} to help other students at UAEU.`}/>
                <link rel="canonical" href={`https://uaeu.space/course/${data.tag}`}/>
                <meta property="og:title" content={`${data.name} - UAEU Space`}/>
                <meta property="og:description"
                      content={filesString || `Find and upload materials for ${data.tag} to help other students at UAEU.`}/>
                <meta property="og:url" content={`https://uaeu.space/course/${data.tag}`}/>
            </Head>

            {/*<ResponsiveAdUnit slotId={4492620959}/>*/}

            <div className={styles.coursePage}>
                <section className={styles.courseInfoHead}>
                    <h2>{data.tag}</h2>
                    <h1>{data.name}</h1>
                </section>

                {/*<ResponsiveAdUnit slotId={8903184422}/>*/}

                <section>
                    <FileUpload courseTag={data.tag}/>
                </section>

                <section className={styles.fileList}>
                    {
                        fileCount > 0 ? data.files.map((value, index) => (
                            <>
                                <File key={index} {...value}/>
                                {/*{Math.floor(fileCount / 2) === index &&
                                    <ResponsiveAdUnit slotId={1529404516}/>}*/}
                            </>
                        )) : <p className={fileStyles.file}>{"There are no files."}</p>
                    }
                </section>

            </div>
        </>
    );
}

export default Course;