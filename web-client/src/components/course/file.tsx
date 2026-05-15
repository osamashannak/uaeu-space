import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {formatBytes, getIconFromMIME} from "../../utils.tsx";
import {CourseFileAPI} from "../../typed/course.ts";
import styles from "../../styles/components/course/file.module.scss";
import {getDownloadLink} from "../../api/course.ts";

dayjs.extend(relativeTime);

export default function File(props: CourseFileAPI) {
    const downloadUrl = getDownloadLink(props.id);
    const uploadedAt = dayjs(props.created_at);

    return (
        <article className={styles.fileWrapper}>
            <a
                className={styles.file}
                target="_blank"
                href={downloadUrl}
                rel="noreferrer nofollow"
                aria-label={`Download ${props.name}`}
                title={props.name}
            >
                <div className={styles.fileIcon}>
                    {getIconFromMIME(props.type)}
                </div>
                <div className={styles.fileBody}>
                    <div className={styles.fileMain}>
                        <h3 className={styles.fileName}>
                            {props.name}
                        </h3>
                        <div className={styles.fileMeta}>
                            <span>{formatBytes(props.size)}</span>
                            <span className={styles.metaDivider}/>
                            <time
                                dateTime={uploadedAt.toISOString()}
                                title={uploadedAt.format("MMM D, YYYY h:mm A")}
                            >{uploadedAt.fromNow()}</time>
                        </div>
                    </div>
                    <div className={styles.fileStats}>
                        <span className={styles.downloads}>
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                                 viewBox="0 0 24 24">
                                <path fill="currentColor"
                                      d="M12 3a1 1 0 0 1 1 1v8.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1ZM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"/>
                            </svg>
                            {props.download_count.toLocaleString()}
                        </span>
                        <span className={styles.downloadLink}>Download</span>
                    </div>
                </div>
            </a>
        </article>
    );
}

