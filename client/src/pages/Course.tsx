import {useParams} from "react-router-dom";
import FileTable from "../components/FileTable";
import {useEffect, useState} from "react";
import {getCourse} from "../api/api";
import {ICourse} from "../utils/Course";
import {Icon} from '@iconify/react';
import bubbleLoading from '@iconify/icons-eos-icons/bubble-loading';
import FileForm from "../components/FileForm";

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
            setIsFetching(false);
        });

    }, [])

    if (isFetching) {
        return (
            <div className={"professor"}>
                <div className={"prof-info-page prof-info-head"}>
                    <p>Loading <Icon icon={bubbleLoading}/></p>
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
                <p className={"course-page-tag"}>{course.tag}</p>
                <p className={"course-page-title"}>{course.name}</p>
                <FileTable files={course.files}/>
                <FileForm courseTag={course.tag}/>
            </div>
        </div>
    )
}

export default Course;