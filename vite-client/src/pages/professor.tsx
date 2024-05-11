import Layout from "../layouts/layout.tsx";
import einstein from "../assets/images/einstien.png";
import {lazy, Suspense, useEffect} from "react";
import styles from "../styles/pages/professor.module.scss";
import {getProfessor} from "../api/professor.ts";
import {useParams} from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import {useDispatch, useSelector} from "react-redux";
import {clearProfessor, selectProfessor, setProfessor} from "../redux/slice/professor_slice.ts";
import {ProfessorAPI, ProfessorHistory} from "../typed/professor.ts";
import LoadingSuspense from "../components/loading_suspense.tsx";
import ReviewSkeleton from "../components/skeletons/review.tsx";
import DisabledReviewForm from "../components/professor/disabled_review_form.tsx";


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
            "email": "alig@uaeu.ac.ae",
            "name": "Ali Gargoum",
            "college": "College of Business and Economics",
            "university": "United Arab Emirates University",
            "reviews": [
                {
                    "id": 5494,
                    "score": 2,
                    "positive": false,
                    "comment": "عصوبي وشرحه خايس  \nHe’s teaching is so bad and boring and makes it harder and more complicated to understand , the quizzes and the midterm exam level was totally different , in my opinion it wasn’t easy at all , I don’t recommend this doctor unless  you are good in math and you are able to teach your self \n- Statistics 180 -",
                    "created_at": "2023-11-27T11:07:44.539Z",
                    "author": "User",
                    "likes": 0,
                    "dislikes": 0,
                    "attachments": null,
                    "self": false,
                    "selfRating": null,
                    "uaeuOrigin": true
                },
                {
                    "id": 5440,
                    "score": 4,
                    "positive": true,
                    "comment": "to be honest, everything was alright, till midterms came along it was hard and it required a lot of practice. \nHe doesn't give bonuses but drops some quizzes and assignment. \nHe tries to understand, but if you can find someone else to teach you the course I recommend you that especially if you're bad at maths and problem solving. ",
                    "created_at": "2023-11-26T13:11:21.151Z",
                    "author": "User",
                    "likes": 0,
                    "dislikes": 0,
                    "attachments": null,
                    "self": false,
                    "selfRating": null,
                    "uaeuOrigin": true
                },
                {
                    "id": 4870,
                    "score": 2,
                    "positive": false,
                    "comment": "no one in class understands his explanation, he makes the course more complicated + he doesn’t listen to our opinions. his class is boring too and if u don’t understand a point he will make u feel like ur stupid.. honestly i would rate him 1.5/5",
                    "created_at": "2023-11-14T17:42:34.536Z",
                    "author": "User",
                    "likes": 0,
                    "dislikes": 0,
                    "attachments": null,
                    "self": false,
                    "selfRating": null,
                    "uaeuOrigin": false
                },
                {
                    "id": 3788,
                    "score": 4,
                    "positive": true,
                    "comment": "good at explaining. fair grades (gives you what you deserve). too many assignments and quizzes which is a good thing and his quizzes are not bad they're somewhat easy. strict which I like and I think is fair. \nthat's it. ",
                    "created_at": "2023-10-30T22:18:22.959Z",
                    "author": "User",
                    "likes": 0,
                    "dislikes": 0,
                    "attachments": null,
                    "self": false,
                    "selfRating": null,
                    "uaeuOrigin": false
                }
            ],
            "canReview": true,
            "score": 3
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
            <Layout>
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
            </Layout>
        );
    }

    if (professor === null) {
        return (
            <Layout>

                <div className={styles.professorNotFound}>
                    <div>
                        <span>Professor not found :(</span>
                        <p>Please DM us on Instagram to add them to the website.</p>
                    </div>
                    <img src={einstein} alt={""}/>
                </div>
            </Layout>
        );
    }

    const score = parseFloat(professor.score.toFixed(1));


    return (
        <Layout>
            <div className={styles.profPage}>

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
        </Layout>
    );
}
