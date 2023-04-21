import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useEffect} from "react";

const NotFound = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
