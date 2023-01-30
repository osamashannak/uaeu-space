import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {IProfessor, IReview} from "../utils/Professor";
import {getProfessor} from "../api/api";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import ReviewSection from "../components/ReviewSection";
import {ReactComponent as Loading} from "../assests/bubble-loading.svg";
import ReviewForm from "../components/ReviewForm";

const Professor = () => {

    const {email} = useParams();
    const [professor, setProfessor] = useState<IProfessor | null>();
    const [score, setScore] = useState<number>(0);
    const {t, i18n} = useTranslation(namespaces.pages.professor);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {

        if (!email) {
            setIsFetching(false);
            return;
        }

        const hasViewed = localStorage.getItem(`${email}-exist`);

        getProfessor(email, hasViewed ?? undefined).then(professor => {
            setProfessor(professor);
            if (professor) {
                localStorage.setItem(`${email}-exist`, 'true');
                if (professor.reviews.length > 0) {
                    let allScore = 0;
                    professor.reviews.forEach((review: IReview) => {
                        allScore += review.score;
                    });
                    setScore(allScore / professor.reviews.length);
                }
            }
        });

        setIsFetching(false);
    }, []);

    if (isFetching) {
        return (
            <div className={"professor"}>
                <div className={"prof-info-page prof-info-head"}>
                    <p>Loading <Loading/></p>
                </div>
            </div>
        );
    }

    if (!professor) {
        return (
            <div className={"professor"}>
                <div className={"prof-info-page prof-info-head"}>
                    <p>Professor Not Found 404</p>
                </div>
            </div>
        )
    }

    return (
        <div className={"professor"}>
            <div className={"prof-info-page"}>
                <div className={"prof-info-head"}>
                    <div className={"prof-info"}>
                        <p className={"prof-name"}>{professor.name}</p>
                        <p className={"department"}>{professor.college}</p>
                    </div>

                    <div className={"prof-overall"}>
                        <p className={"overall-score"}>{parseFloat(score.toFixed(1))}<span
                            className={"score-out-of"}>/5</span></p>
                    </div>
                </div>
                <ReviewSection reviews={professor.reviews}/>
                <ReviewForm email={email!}/>
            </div>
        </div>
    );
}

export default Professor;