import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import reading from "../assests/Group 1.png";
import professor from "../assests/Group 2.png";
import SearchBoxElement from "../components/SearchBox";
import {Icon} from '@iconify/react';
import arrowForwardIos from '@iconify/icons-material-symbols/arrow-forward-ios';
import {Link} from "react-router-dom";

const Home = () => {

    const {t, i18n} = useTranslation(namespaces.pages.home);

    return (
        <div className={"home"}>

            <div className={"help-us"}>
                <p className={"help-us-icon"}>💙</p>
                <p>{t("alert.description")}</p>
            </div>

            <section className={"course-materials"}>
                <span className={"section-title"}>{t("course_box.title")}</span>
                <p className={"section-desc"}>{t("course_box.description")}</p>
                <div>
                    <SearchBoxElement type={"course"}/>
                </div>
                <img className={"reading-image"} src={reading}/>
            </section>
            <div className={"separator"}>&nbsp;</div>
            <section className={"professor-materials"}>
                <p className={"section-title"}>{t("professor_box.title")}</p>
                <p className={"section-desc"}>{t("professor_box.description")}</p>
                {/*<Link to={"/compare"} className={"compare-professor"}>Compare Professors <Icon icon={arrowForwardIos}/></Link>*/}
                <SearchBoxElement type={"professor"}/>
                <img className={"professor-image"} src={professor}/>
            </section>


        </div>
    );

}

export default Home;