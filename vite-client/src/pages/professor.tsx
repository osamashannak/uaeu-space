import einstein from "../assets/images/einstien.png";
import {lazy, Suspense, useEffect} from "react";
import styles from "../styles/pages/professor.module.scss";
import {getProfessor} from "../api/professor.ts";
import {useNavigate, useParams} from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import {useDispatch, useSelector} from "react-redux";
import {clearProfessor, selectProfessor, setProfessor} from "../redux/slice/professor_slice.ts";
import {ProfessorAPI, ProfessorHistory} from "../typed/professor.ts";
import LoadingSuspense from "../components/loading_suspense.tsx";
import ReviewSkeleton from "../components/skeletons/review.tsx";
import DisabledReviewForm from "../components/professor/disabled_review_form.tsx";
import BackArrow from "../components/backarrow.tsx";


const ReviewForm = lazy(async () => {
    const [moduleExports] = await Promise.all([
        await import("../components/professor/review_form.tsx"),
        new Promise(resolve => setTimeout(resolve, 500))
    ]);
    return moduleExports;
});

const ReviewSection = lazy(async () => {
    const [moduleExports] = await Promise.all([
        await import("../components/professor/review_section.tsx"),
        new Promise(resolve => setTimeout(resolve, 1000))
    ]);
    return moduleExports;
});

export default function Professor() {
    const {email} = useParams();

    const dispatch = useDispatch();
    const professorState = useSelector(selectProfessor);

    const professor = professorState.professor as ProfessorAPI | undefined | null;

    /*useEffect(() => {
        if (!email) {
            dispatch(setProfessor(null));
            return;
        }

        getProfessor(email).then((professor) => {
            dispatch(setProfessor(professor));
        })

        return () => {
            dispatch(clearProfessor());
        }
    }, [dispatch, email]);*/

    useEffect(() => {
        dispatch(setProfessor({
            "email": "esraa@uaeu.ac.ae",
            "name": "Esraa Gasim",
            "college": "College of Information Technology",
            "university": "United Arab Emirates University",
            "reviews": [
                {
                    "id": 11481,
                    "score": 1,
                    "positive": false,
                    "comment": "$%#@??///",
                    "soft_delete": false,
                    "created_at": "2024-08-15T15:21:13.427Z",
                    "author": "User",
                    "likes": 0,
                    "dislikes": 0,
                    "comments": 0,
                    "attachments": null,
                    "self": false,
                    "selfRating": null,
                    "uaeuOrigin": false
                }
            ],
            "canReview": true,
            "score": 1
        }))
    }, []);


    useEffect(() => {
        if (professor) {

            const professorHistory = JSON.parse(localStorage.getItem("professorHistory") || "[]") as ProfessorHistory[];

            const professorIndex = professorHistory.findIndex((prof) => prof.email === professor.email);

            if (professorIndex !== -1) {
                professorHistory.splice(professorIndex, 1);
            }

            professorHistory.unshift({
                name: professor.name,
                email: professor.email,
                university: professor.university,
                date: new Date()
            });

            if (professorHistory.length > 10) {
                professorHistory.pop();
            }

            localStorage.setItem("professorHistory", JSON.stringify(professorHistory));
        }
    }, [professor]);

    if (professor === undefined) {
        return (

            <div className={styles.profPage}>

                <section className={styles.profInfoHead} style={{borderBottom: "none"}}>
                    <div className={styles.profInfoLeft}>
                        <h1 style={{width: "100px"}}><Skeleton/></h1>
                        <p style={{width: "200px"}}><Skeleton/></p>
                    </div>

                    <div className={styles.profInfoRight}>
                        <p className={styles.score}><Skeleton/></p>
                    </div>
                </section>

                <div className={styles.commentsSection}>


                    <ReviewSkeleton/>
                    <ReviewSkeleton/>
                    <ReviewSkeleton/>
                    <ReviewSkeleton/>

                </div>

            </div>
        );
    }

    if (professor === null) {
        // @ts-expect-error Clarity is not defined
        clarity("set", "NoProfessor", "true");
        return (

            <div className={styles.professorNotFound}>
                <div>
                    <span>Professor not found :(</span>
                    <p>Please DM us on Instagram to add them to the website.</p>
                </div>
                <img src={einstein} alt={""}/>
            </div>
        );
    }

    const score = parseFloat(professor.score.toFixed(1));


    return (
        <div className={styles.profPage}>
            <BackArrow text={"Professor"} url={"/professor"}/>

            <section className={styles.profInfoHead}>

                <div className={styles.infoLeft}>
                    {score > 0 ?
                        <div className={styles.infoLeftScore}>
                            <span className={styles.score}>{score}</span>
                            <span className={styles.outOf}>/5</span>
                        </div>
                        :
                        <span className={styles.score}>N/A</span>}
                </div>

                <div className={styles.infoRight}>
                    <p className={styles.universityName}>{professor.university}</p>
                    <h1>{professor.name}</h1>
                    <span className={styles.collegeName}>{professor.college}</span>
                </div>

            </section>


            <Suspense fallback={<DisabledReviewForm/>}>
                <ReviewForm professorEmail={professor.email} canReview={professor.canReview}/>
            </Suspense>

            <Suspense fallback={<LoadingSuspense/>}>
                <ReviewSection professorReviews={professor.reviews}/>
            </Suspense>

        </div>
    );
}
