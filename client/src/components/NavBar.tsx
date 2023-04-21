import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {languages} from "../i18n";
import logo from "../assests/favicon.png";
import instagramIcon from '@iconify/icons-mdi/instagram';
import {Icon} from '@iconify/react';

const NavBar = () => {
    const {t, i18n} = useTranslation();

    const changeLanguage = ((language: string) => async () => {
            await i18n.changeLanguage(language);
        }
    );

    const openInstagram = () => {
        window.open("https://instagram.com/uaeu.space", "_blank");
    }

    return (
        <header>
            <Link className={"title"} to={"/"}><img className={"logo-icon"} src={logo} width={"20px"}/>UAEU Space</Link>
            <div className={"right-side-nav"}>
                <Icon icon={instagramIcon} className={"instagram-nav"} onClick={openInstagram}/>
                <button
                    onClick={changeLanguage(i18n.language === languages.en ? 'ar' : 'en-US')}
                    className={"nav-choice change-locale"}>{i18n.language === languages.en ? 'عربي' : 'English'}</button>

            </div>
        </header>
    );
}

export default NavBar;