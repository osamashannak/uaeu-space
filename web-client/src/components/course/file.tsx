import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {formatBytes, getIconFromMIME} from "../../utils.tsx";
import {CourseFileAPI} from "../../typed/course.ts";
import styles from "../../styles/components/course/file.module.scss";

dayjs.extend(relativeTime);

export default function File(props: CourseFileAPI) {
    return (
        <div className={styles.fileWrapper}>
            <div className={styles.file}>
                <div className={styles.fileIcon}>
                    {getIconFromMIME(props.type)}
                </div>
                <div className={styles.fileBody}>
                    <h3 className={styles.fileName}>
                        <a style={{color: "#007fff"}}
                           target="_blank"
                           href={"https://api.uaeu.space/course/file?id=" + props.id}
                           rel="noreferrer nofollow"
                           title={props.name}>{props.name}</a>
                    </h3>
                    <p className={styles.fileSize}>{formatBytes(props.size)}</p>
                    <time
                        className={styles.uploadTime}
                        dateTime={props.created_at.toString()}
                        title={dayjs(props.created_at).format("MMM D, YYYY h:mm A")}
                    >{dayjs(props.created_at).fromNow()}</time>
                    <div className={styles.downloads}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <rect width="24" height="24" fill="none"/>
                            <path fill="currentColor"
                                  d="M12 6a1 1 0 0 0-1 1v10a1 1 0 0 0 2 0V7a1 1 0 0 0-1-1m-5 6a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1m10-2a1 1 0 0 0-1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0-1-1m2-8H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3m1 17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1Z"/>
                        </svg>
                        <span>{props.download_count.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

