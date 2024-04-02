import {createBrowserRouter} from "react-router-dom";
import Root from "../pages/root.tsx";
import Professor from "../pages/professor.tsx";
import ProfessorLookup from "../pages/professor_lookup.tsx";
import Course from "../pages/course.tsx";
import CourseLookup from "../pages/course_lookup.tsx";
import Login from "../pages/login.tsx";
import TermsOfService from "../pages/legal/tos.tsx";
import Privacy from "../pages/legal/privacy.tsx";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
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
    }
]);

export default Router;
