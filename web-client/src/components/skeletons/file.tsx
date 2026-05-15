import Skeleton from "react-loading-skeleton";
import styles from "../../styles/components/course/file.module.scss";


export default function FileSkeleton() {
    return (
        <div className={styles.fileWrapper}>
            <div className={styles.file}>
                <div className={styles.fileIcon} style={{width: "38px", height: "38px"}}>
                    <Skeleton height={38} width={38}/>
                </div>
                <div className={styles.fileBody}>
                    <div className={styles.fileMain}>
                        <h3 className={styles.fileName} style={{width: "130px"}}>
                            <Skeleton/>
                        </h3>
                        <div className={styles.fileMeta} style={{width: "150px"}}>
                            <Skeleton/>
                        </div>
                    </div>
                    <div className={styles.fileStats} style={{width: "95px"}}>
                        <Skeleton/>
                    </div>
                </div>
            </div>
        </div>
    )
}
