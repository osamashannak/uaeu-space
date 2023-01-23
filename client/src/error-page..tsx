import {Link, useRouteError} from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    // @ts-ignore
    const reason = error.statusText || error.message;
    // @ts-ignore
    const status = error.status;

    return (
        <div className={"error-page"}>
            <h3>Oops!</h3>
            <p>{status} - {reason.toUpperCase()}</p>
            <Link to={"/"} className={"error-button"}>Homepage</Link>
        </div>
    );
}
export default ErrorPage;
