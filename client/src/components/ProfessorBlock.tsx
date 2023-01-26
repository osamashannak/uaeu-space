import {IProfessor, ratingToIcon, ReviewProps} from "../utils/Professor";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import ReviewSection from "./ReviewSection";


const ProfessorBlock = (props: IProfessor) => {

    const [score, setScore] = useState({quality: 0, difficulty: 0});
    const {t, i18n} = useTranslation(namespaces.pages.professor);

    useEffect(() => {
        let qualityScore = 0;
        let difficultyScore = 0;
        props.reviews.forEach(review => {
            qualityScore+=review.quality;
            difficultyScore+=review.difficulty;
        });
        setScore({quality: qualityScore/props.reviews.length, difficulty: difficultyScore/props.reviews.length});
    }, []);

    return (
        <div>
            <div className={"prof-info-head"}>
                <div className={"prof-info"}>
                    <p className={"prof-name"}>{props?.name}</p>
                    <p className={"department"}>{props?.department}</p>
                </div>

                <div className={"prof-overall"}>
                    <p className={"overall-score"}>{((score.quality + score.difficulty) / 2).toFixed(1)}<span
                        className={"score-out-of"}>/5</span></p>

                    <div>
                        <p className={"rating-category"}>{t("quality")}: <span className={"stars"}>
                                {ratingToIcon(score.quality)}
                            </span>
                        </p>

                        <p className={"rating-category"}>{t("difficulty")}: <span className={"stars"}>
                                {ratingToIcon(score.difficulty)}
                            </span>
                        </p>
                    </div>

                    <button className={"review-button"}><Link to={"rate"}>Rate this professor</Link></button>

                </div>
            </div>
            <ReviewSection reviews={props.reviews}/>
        </div>
    );

}

export default ProfessorBlock