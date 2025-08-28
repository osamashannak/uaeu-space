import {createBrowserRouter, Navigate} from "react-router-dom";
import Professor from "../pages/professor.tsx";
import ProfessorLookup from "../pages/professor_lookup.tsx";
import Course from "../pages/course.tsx";
import CourseLookup from "../pages/course_lookup.tsx";
import TermsOfService from "../pages/legal/tos.tsx";
import Privacy from "../pages/legal/privacy.tsx";
import Login from "../pages/login.tsx";
import Layout from "../layouts/layout.tsx";
import Notifications from "../pages/notifications.tsx";
import ScheduleMaker from "../pages/schedule_maker.tsx";
import PageNotFound from "../pages/page_not_found.tsx";
import Feedback from "../pages/feedback.tsx";

const Router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Navigate to={"/professor"}/>
            },
            {
                path: "notifications",
                element: <Notifications/>
            },
            {
                path: "terms-of-service",
                element: <TermsOfService/>
            },
            {
                path: "privacy",
                element: <Privacy/>
            },
            {
                path: "professor",

                element: <ProfessorLookup/>
            },
            {
                path: "professor/:email",
                element: <Professor/>,
            },
            {
                path: "course",
                element: <CourseLookup/>
            },
            {
                path: "course/:tag",
                element: <Course/>,
            },
            {
                path: "schedule",
                element: <ScheduleMaker/>
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "feedback",
                element: <Feedback/>
            },
            {
                path: "*",
                element: <PageNotFound/>
            }
        ]
    }
]);

export default Router;
