import {useParams} from "react-router-dom";
import FileTable from "../components/FileTable";
import {useEffect} from "react";

const Course = () => {

    const {tag} = useParams();

    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: "smooth"});
    })

    return (
        <div className={"course"}>
            <p className={"course-title"}>{tag}</p>
            <FileTable/>
        </div>
    )
}

export default Course;