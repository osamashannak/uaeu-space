import styles from "@/styles/Course.module.scss";
import Skeleton from "react-loading-skeleton";
import FileSkeleton from "@/app/course/[tag]/FileSkeleton";
import 'react-loading-skeleton/dist/skeleton.css'


const Loading = () => {
    return (
        <div className={styles.coursePage}>
            <section className={styles.courseInfoHead} style={{width: "100%", borderBottom: 0}}>
                <h2 style={{width: "100px"}}><Skeleton /></h2>
                <h1 style={{width: "200px"}}><Skeleton /></h1>
            </section>

            <section className={styles.fileList}>
                <FileSkeleton/>
                <FileSkeleton/>
                <FileSkeleton/>
                <FileSkeleton/>
            </section>

        </div>
    )
}

export default Loading;