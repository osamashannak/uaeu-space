import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {languages} from "../i18n";

const NavBar = () => {
    const {t, i18n} = useTranslation();

    const changeLanguage = ((language: string) => async () => {
            await i18n.changeLanguage(language);
        }
    );

    return (
        <div className={"nav-bar"}>
            <Link className={"title"} to={"/"}>📚 UAEU Space.</Link>
            <div>
                <ul>
                    <button
                        onClick={changeLanguage(i18n.language === languages.en ? 'ar' : 'en-US')}
                        className={"nav-choice change-locale"}>{i18n.language === languages.en ? 'عربي' : 'English'}</button>
                </ul>
            </div>
        </div>
    );
}

export default NavBar;