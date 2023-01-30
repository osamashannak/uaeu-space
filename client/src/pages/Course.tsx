import {useParams} from "react-router-dom";
import FileTable from "../components/FileTable";
import {useEffect, useState} from "react";
import {getCourse} from "../api/api";
import {ICourse} from "../utils/Course";
import {ReactComponent as Loading} from "../assests/bubble-loading.svg";

const Course = () => {

    const {tag} = useParams();

    // const {t, i18n} = useTranslation(namespaces.pages.course);
    const [isFetching, setIsFetching] = useState(true);
    const [course, setCourse] = useState<ICourse | null>();

    useEffect(() => {
        if (!tag) {
            setIsFetching(false);
            return;
        }

        const hasViewed = localStorage.getItem(`${tag}-exist`);

        getCourse(tag, hasViewed ?? undefined).then(course => {
            setCourse(course);
            if (course) {
                localStorage.setItem(`${tag}-exist`, 'true');
            }
        });

        setIsFetching(false);
    }, [])

    if (isFetching) {
        return (
            <div className={"professor"}>
                <div className={"prof-info-page prof-info-head"}>
                    <p>Loading <Loading/></p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className={"course"}>
                <div className={"course-info-page"}>
                    <p>Course Not Found 404</p>
                </div>
            </div>
        )
    }

    return (
        <div className={"course"}>
            <div className={"course-info-page"}>
                <div className={"course-header"}>
                    <p className={"course-page-tag"}>{course.tag}</p>
                    <p className={"course-page-title"}>{course.name}</p>
                </div>
                <FileTable files={course.files}/>
            </div>
        </div>
    )
}

export default Course;