import {Link} from "react-router-dom";


const Footer = () => {
    return (
        <div className={"footer"}>
            <p>Copyright © 2023. Illustrations courtesy of <u><a className={"foot-link"} target="_blank"
                                                                 rel="noreferrer"
                                                                 href="https://undraw.co">Undraw</a></u>.</p>
            <Link className={"foot-link"} to="/contact">Contact me</Link>
        </div>
    );
}

export default Footer;