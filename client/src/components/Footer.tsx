import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import {Icon} from '@iconify/react';
import instagramIcon from '@iconify/icons-skill-icons/instagram';


const Footer = () => {
    const {t, i18n} = useTranslation(namespaces.components.footer);

    return (
        <footer>
            <section className={"info"}>
                <span>{t("info.title")}</span>
                <ul>
                    <li><span>{t("info.paragraph1")}</span></li>
                    <li><span>{t("info.paragraph2")}</span></li>
                    <li><span>{t("info.paragraph3")} <a target="_blank"
                                                        rel="noreferrer"
                                                        className={"github-link"}
                                                        href="https://github.com/Am4nso/uaeu-space">GitHub</a>.</span>
                    </li>

                </ul>
            </section>
            <section className={"footer"}>
                <p>{t("copyright")} <a className={"foot-link"} target="_blank"
                                       rel="noreferrer"
                                       href="https://iconify.design">Iconify</a>.</p>
                <Link className={"foot-link"} to={"/sitemap"}>Sitemap</Link>
            </section>
        </footer>
    );
}

export default Footer;