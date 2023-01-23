import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";


const Footer = () => {
    const {t, i18n} = useTranslation(namespaces.components.footer);

    return (
        <div className={"footer"}>
            <p>{t("copyright")} <a className={"foot-link"} target="_blank"
                                   rel="noreferrer"
                                   href="https://iconify.design">Iconify</a>.</p>
            <Link className={"foot-link"} to="/contact">{t("contact")}</Link>
        </div>
    );
}

export default Footer;