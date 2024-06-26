import {formatBytes, getIconFromMIME} from "@/utils";
import styles from "@/styles/components/File.module.scss";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {CourseFileAPI} from "@/interface/course";

dayjs.extend(relativeTime)

const File = (props: CourseFileAPI) => {
    return (
        <div className={styles.file}>
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
                <time
                    dateTime={props.created_at.toString()}
                    title={dayjs(props.created_at).format("MMM D, YYYY h:mm A")}
                >{dayjs(props.created_at).fromNow()}</time>
            </div>
        </div>
    );
}

export default File;