import {createBrowserRouter, Navigate} from "react-router-dom";
import Professor from "../pages/professor.tsx";
import ProfessorLookup from "../pages/professor_lookup.tsx";
import Course from "../pages/course.tsx";
import CourseLookup from "../pages/course_lookup.tsx";
import TermsOfService from "../pages/legal/tos.tsx";
import Privacy from "../pages/legal/privacy.tsx";
import Error from "../pages/error.tsx";
import Login from "../pages/login.tsx";
import Layout from "../layouts/layout.tsx";
import Notifications from "../pages/notifications.tsx";

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
                path: "login",
                element: <Login/>
            },
            {
                path: "*",
                element: <Error/>
            }
        ]
    }
]);

export default Router;
