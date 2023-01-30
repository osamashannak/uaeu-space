import {ReactComponent as Ellipses} from "../assests/dots-vertical.svg";
import {useEffect} from "react";
import {formatBytes, IFile} from "../utils/Course";
import {dateHumanize} from "../utils/Global";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";

const FileTable = (props: { files: IFile[] }) => {
    const {t, i18n} = useTranslation();

    useEffect(() => {
        // TODO get course details (name, files)
    })

    return (
        <table className={"files-table"}>
            <tbody>
            <tr className={"row"}>
                <th className={"top-text-style"}>Name</th>
                <th className={"top-text-style"}>Size</th>
                <th className={"top-text-style"}>Data Uploaded</th>
                <th className={"top-text-style"}>Action</th>
            </tr>
            {
                props.files.map((value, index) => (
                    <tr className={"table-row"}>
                        <td className={"file-name text-style"}>{value.name}</td>
                        <td className={"file-size text-style"}>{formatBytes(value.size)}</td>
                        <td className={"upload-date text-style"}>{dateHumanize(value.created_at, i18n.language)}</td>
                        <td className={"file-action text-style"}>
                            <Ellipses/>
                        </td>
                    </tr>
                ))
            }
            </tbody>
        </table>
    );

}


export default FileTable;