import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

const NavBar = () => {
    const {t, i18n} = useTranslation();

    const changeLanguage = ((language: string) => async () => {
            console.log("changed language to " + language)
            await i18n.changeLanguage(language);
        }
    );

    return (
        <div className={"nav-bar"}>
            <Link className={"title"} to={"/"}>📚 UAEU Resources.</Link>
            <div>
                <ul>
                    <button onClick={changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
                            className={"nav-choice change-locale"}>{i18n.language === 'en' ? 'عربي' : 'English'}</button>
                </ul>
            </div>
        </div>
    );
}

export default NavBar;