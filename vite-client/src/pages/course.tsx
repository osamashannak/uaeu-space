import {CourseAPI} from "../typed/course.ts";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getCourse} from "../api/course.ts";
import Layout from "../layouts/layout.tsx";
import FileSkeleton from "../components/skeletons/file.tsx";
import Skeleton from "react-loading-skeleton";
import styles from "../styles/pages/course.module.scss";
import FileUpload from "../components/course/file_upload.tsx";
import File from "../components/course/file.tsx";
import fileStyles from "../styles/components/course/file.module.scss";

export default function Course() {
    const [course, setCourse] = useState<CourseAPI | undefined | null>();
    const {tag} = useParams();

    useEffect(() => {
        if (!tag) {
            setCourse(null);
            return;
        }

        getCourse(tag).then((course) => {
            console.log(course)
            setCourse(course);
        })

    }, [tag]);

    if (course === undefined) {
        return (
            <Layout>
                <div className={styles.coursePage}>
                    <section className={styles.courseInfoHead} style={{width: "100%", borderBottom: 0}}>
                        <h2 style={{width: "100px"}}><Skeleton/></h2>
                        <h1 style={{width: "200px"}}><Skeleton/></h1>
                    </section>

                    <section className={styles.fileList}>
                        <FileSkeleton/>
                        <FileSkeleton/>
                        <FileSkeleton/>
                        <FileSkeleton/>
                    </section>

                </div>
            </Layout>
        )
    }

    if (course === null) {
        return (
            <Layout>
                <div className={styles.coursePage}>
                    <section className={styles.courseInfoHead} style={{width: "100%", borderBottom: 0}}>
                        <h2 style={{width: "100px"}}>Course Not Found</h2>
                        <h1 style={{width: "200px"}}>Course Not Found</h1>
                    </section>

                    <section className={styles.fileList}>
                        <p className={styles.file}>Course not found.</p>
                    </section>

                </div>
            </Layout>
        )
    }


    const files = course.files.length > 0 ? [...course.files].sort((a, b) => b.name.length -
        a.name.length).slice(0, 3).map((value) => value.name) : [];
    let filesString = files.length > 0 ? `Download ${files.join(", ")}` : "";

    const fileCount = course.files.length;

    return (
        <Layout>

            <div className={styles.coursePage}>
                <section className={styles.courseInfoHead}>
                    <h2>{course.tag}</h2>
                    <h1>{course.name}</h1>
                </section>

                <section>
                    <FileUpload courseTag={course.tag}/>
                </section>

                <section className={styles.fileList}>
                    {
                        fileCount > 0 ? course.files.map((value, index) => (
                            <File key={index} {...value}/>
                        )) : <p className={fileStyles.file}>{"There are no files."}</p>
                    }
                </section>

            </div>
        </Layout>
    );
}

