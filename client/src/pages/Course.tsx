import {useParams} from "react-router-dom";
import FileTable from "../components/FileTable";
import {useEffect, useState} from "react";
import {getCourse} from "../api/api";
import {ICourse} from "../utils/Course";
import {Icon} from '@iconify/react';
import bubbleLoading from '@iconify/icons-eos-icons/bubble-loading';
import FileForm from "../components/FileForm";
import {Helmet} from "react-helmet";

const Course = () => {

    const {tag} = useParams();

    const [isFetching, setIsFetching] = useState(true);
    const [course, setCourse] = useState<ICourse | null>();

    useEffect(() => {
        window.scrollTo(0, 0);

        if (!tag) {
            setIsFetching(false);
            return;
        }

        const clientKey = localStorage.getItem(`clientKey`)!;

        getCourse(tag, clientKey).then(course => {
            setCourse(course);
            setIsFetching(false);
        });

    }, [tag])

    if (isFetching) {
        return (
            <div className={"course"}>
                <Helmet>
                    <meta name="description"
                          content={`Download and upload learning material to help students at UAEU.`}/>
                </Helmet>

                <div className={"prof-info-page prof-info-head"}>
                    <p>Loading <Icon icon={bubbleLoading}/></p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className={"course"}>
                <Helmet>
                    <meta name="description"
                          content={`Download and upload learning material to help students at UAEU.`}/>
                </Helmet>
                <div className={"prof-not-found"}>
                    <p>Course Not Found 404</p>
                </div>
            </div>
        )
    }

    return (
        <div className={"course"}>

            <Helmet>
                <title>{course.tag}</title>
                <meta name="description"
                      content={`Download and upload learning material for ${course.name} to help students at UAEU.`}/>
            </Helmet>

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