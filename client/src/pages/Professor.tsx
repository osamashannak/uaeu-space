import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {IProfessor, IReview} from "../utils/Professor";
import {getProfessor} from "../api/api";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import ReviewSection from "../components/ReviewSection";
import {Icon} from '@iconify/react';
import bubbleLoading from '@iconify/icons-eos-icons/bubble-loading';
import ReviewForm from "../components/ReviewForm";
import {Helmet} from "react-helmet";
import einstein from "../assests/einstien.png";

const Professor = () => {

    const {email} = useParams();
    const [professor, setProfessor] = useState<IProfessor | null>();
    const [score, setScore] = useState<number>(0);
    const {t, i18n} = useTranslation(namespaces.pages.professor);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        if (!email) {
            setIsFetching(false);
            return;
        }

        const hasViewed = localStorage.getItem(`${email}-exist`) === 'true';

        getProfessor(email, hasViewed).then(professor => {
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
            setIsFetching(false);
        });

    }, []);

    if (isFetching) {
        return (
            <div className={"professor"}>
                <Helmet>
                    <meta name="description"
                          content={`Rate a professor or learn from other students about their performance. .`}/>
                </Helmet>
                <div className={"prof-info-page prof-info-head"}>
                    <p>Loading <Icon icon={bubbleLoading}/></p>
                </div>
            </div>
        );
    }

    if (!professor) {
        return (
            <div className={"professor"}>
                <Helmet>
                    <meta name="description"
                          content={`Rate a professor or learn from other students about their performance. .`}/>
                </Helmet>
                <div className={"prof-not-found"}>
                    <div>
                        <span>Professor not found :(</span>
                        <p>Please DM us on Instagram to add them to the website.</p>
                    </div>
                    <img src={einstein}/>
                </div>
            </div>
        )
    }

    return (
        <div className={"professor"}>
            <Helmet>
                <title>{professor.name}</title>
                <meta name="description"
                      content={`Rate ${professor.name} or learn from other students about their performance. .`}/>
            </Helmet>
            <section className={"prof-info-page"}>
                <div className={"prof-info-head"}>
                    <div className={"prof-info"}>
                        <p className={"prof-name"}>{professor.name}</p>
                        <p>{professor.college}</p>
                    </div>

                    <div className={"prof-overall"}>
                        <p className={"overall-score"}>{parseFloat(score.toFixed(1))}<span
                            className={"score-out-of"}>/5</span></p>
                    </div>
                </div>
            </section>
            <ReviewSection reviews={professor.reviews}/>
            <ReviewForm email={email!}/>

        </div>
    );
}

export default Professor;