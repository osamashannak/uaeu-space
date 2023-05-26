import Rating from "@/components/Rating";
import {formatBytes, getIconFromMIME} from "@/utils";
import styles from "@/styles/components/File.module.scss";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {CourseFileAPI} from "@/interface/course";

dayjs.extend(relativeTime)

const File = (props: CourseFileAPI) => {
    return (
        <article className={styles.file}>
            <div className={styles.fileIcon}>
                {getIconFromMIME(props.type)}
            </div>
            <div className={styles.fileBody}>
                <h3 className={styles.fileName}>
                    <a target="_blank"
                       style={{color: "#007fff"}}
                       rel="noreferrer nofollow"
                       href={"https://api.uaeu.space/course/file?id=" + props.id}
                       title={props.name}>{props.name}</a>
                </h3>
                <p className={"file-size"}>{formatBytes(props.size)}</p>
                <p>{dayjs(props.created_at).fromNow()}</p>
                <div className={styles.fileRating}>
                    <Rating dislikes={props.dislikes} likes={props.likes} id={props.id} type={"file"}/>
                </div>
            </div>
        </article>
    );
}

export default File;