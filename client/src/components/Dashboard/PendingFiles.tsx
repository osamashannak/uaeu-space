import {useEffect, useState} from "react";
import styles from "@/styles/Dashboard.module.scss";
import {getPendingFiles} from "@/api/dashboard";
import {DashboardFileAPI} from "@/interface/dashboard";
import File from "@/components/Course/File";


const PendingFiles = (props: {course: string | null}) => {
    const [files, setFiles] = useState<DashboardFileAPI[]>();

    useEffect(() => {
        if (!files || files.length === 0) {
            const token = sessionStorage.getItem("token")!;
            getPendingFiles(token).then((data) => {
                setFiles(data == undefined ? [] : data);
            });
        }
    }, [files]);



    if (files == undefined) {
        return (
            <p>Loading...</p>
        )
    }

    if (files.length === 0) {
        return (
            <p>There are no files pending for review.</p>
        )
    }

    const downloadClick = (id: number) => {
        return () => {
            const token = sessionStorage.getItem("token")!;
            window.open("https://api.uaeu.space/course/file?id=" + id + "&token=" + token, "_blank");
        }
    }

    return (
        <>
            {
                files.map((file, index) => (
                    <div key={index}>
                        <File {...file}/>
                        <span> {file.course?.name ?? "Unknown"}</span>
                        <div>&nbsp;</div>
                        <div className={styles.buttons}>
                            <div className={styles.approveButton}>Approve</div>
                            <div className={styles.hideButton}>Hide</div>
                            <div onClick={downloadClick(file.id)} className={styles.downloadButton}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11l-5 5Zm-8 4v-5h2v3h12v-3h2v5H4Z"/></svg></div>
                        </div>
                    </div>
                ))
            }
        </>
    )

}

export default PendingFiles;