import {Link} from "react-router-dom";


const NavBar = () => {
    return (
        <div className={"nav-bar"}>
            <Link className={"title"} to={"/"}>📚 UAEU Resources.</Link>
            <div>
                <ul>
                    <Link to={"/"} className={"nav-choice change-locale"}>عربي</Link>
                </ul>
            </div>
        </div>
    );
}

export default NavBar;