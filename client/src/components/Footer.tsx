import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import {Icon} from '@iconify/react';
import instagramIcon from '@iconify/icons-skill-icons/instagram';


const Footer = () => {
    const {t, i18n} = useTranslation(namespaces.components.footer);

    return (
        <div className={"footer"}>
            <p>{t("copyright")} <a className={"foot-link"} target="_blank"
                                   rel="noreferrer"
                                   href="https://iconify.design">Iconify</a>.</p>
            <p className={"foot-link"}><Icon icon={instagramIcon}/> Follow <a
                href="https://instagram.com/uaeu.space" style={{
                textDecoration: 'none',
                color: 'darkblue',

            }}>@uaeu.space</a></p>
        </div>
    );
}

export default Footer;