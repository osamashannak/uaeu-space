import {Link} from "react-router-dom";

const NotFound = () => {

    return (
        <div className={"error-page"}>
            <h3>Oops!</h3>
            <p>Page Not Found</p>
            <Link to={"/"} className={"error-button"}>Homepage</Link>
        </div>
    );
}
export default NotFound;
