import Box from "../components/Box";
import {ReactComponent as InfoSVG} from "../assests/information-variant.svg";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";

const Home = () => {

    const {t, i18n} = useTranslation(namespaces.pages.home);

    return (
        <div className={"home"}>
            <div className={"help-us"}>
                <p className={"alert"}>{t("alert.title")}</p>
                <p>{t("alert.description")}</p>
            </div>
            <div className={"boxes"}>
                <Box
                    title={t("course_box.title")}
                    descriptions={t("course_box.description")}
                    searchBoxProps={{
                        type: "course"
                    }}/>
                <Box
                    title={t("professor_box.title")}
                    descriptions={t("professor_box.description")}
                    searchBoxProps={{
                        type: "professor"
                    }}/>
            </div>
            <div className={"info"}>
                <p className={"info-title"}><InfoSVG/> {t("info.title")}</p>
                <li className={"info-description"}>
                    {t("info.paragraph1")}
                </li>
                <li className={"info-description"}>
                    {t("info.paragraph2")} <Link className={"foot-link"} to={"/report"}>
                    {t("info.paragraph2_reportit")}</Link>
                </li>
                <li className={"info-description"}>
                    {t("info.paragraph3")} <a target="_blank"
                                              rel="noreferrer"
                                              className={"foot-link"}
                                              href="https://github.com/Am4nso/uaeu-resources">GitHub</a>. {t("info.paragraph3_welcome")}
                </li>
            </div>

        </div>
    );

}

export default Home;