import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";

const NotFound = () => {

    return (
        <div className={"error-page"}>
            <Helmet>
                <title>404</title>
            </Helmet>
            <h3>Oops!</h3>
            <p>Page Not Found</p>
            <Link to={"/"} className={"error-button"}>Homepage</Link>
        </div>
    );
}
export default NotFound;
