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
import {ProfessorAPI} from "../typed/professor.ts";
import {Helmet} from "react-helmet-async";

const ReviewForm = lazy(
    async () => await import("../components/professor/review_form.tsx")
);
const ReviewSection = lazy(
    async () => await import("../components/professor/review_section.tsx")
);
const ReviewSkeleton = lazy(
    async () => await import("../components/skeletons/review.tsx")
);


export default function Professor() {
    const {email} = useParams();

    const dispatch = useDispatch();
    const professorState = useSelector(selectProfessor);

    const professor = professorState.professor as ProfessorAPI | undefined | null;


    useEffect(() => {
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
    }, [dispatch, email]);

    if (professor === undefined) {
        return (
            <Layout>
                <div className={styles.profPage}>

                    <section className={styles.profInfoHead}>
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
                <Helmet>
                    <title>SpaceRead</title>
                    <meta name="description"
                          content={mostLengthReview || `Rate ${professor.name} or learn from other students about their performance.`}/>
                    <link rel="canonical" href={`https://spaceread.net/professor/${professor.email}`}/>
                    <meta property="og:title" content={`Discover {professor.name}'s Reviews and Ratings - SpaceRead`}/>
                    <meta property="og:description"
                          content={mostLengthReview || `Rate ${professor.name} or learn from other students about their performance.`}/>
                    <meta property="og:url" content={`https://spaceread.net/professor/${professor.email}`}/>
                </Helmet>

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

    const mostLengthReview = professor.reviews.length > 0 ? professor.reviews.reduce((prev, current) => (prev.comment.length > current.comment.length) ? prev : current).comment : "";

    return (
        <Layout>
            <Helmet>
                <title>Discover {professor.name}'s Reviews and Ratings - SpaceRead</title>
                <meta name="description"
                      content={mostLengthReview || `Rate ${professor.name} or learn from other students about their performance.`}/>
                <link rel="canonical" href={`https://spaceread.net/professor/${professor.email}`}/>
                <meta property="og:title" content={`Discover {professor.name}'s Reviews and Ratings - SpaceRead`}/>
                <meta property="og:description"
                      content={mostLengthReview || `Rate ${professor.name} or learn from other students about their performance.`}/>
                <meta property="og:url" content={`https://spaceread.net/professor/${professor.email}`}/>
            </Helmet>

            <div className={styles.profPage}>
                <section className={styles.profInfoHead}>
                    <div className={styles.profInfoLeft}>
                        <h1>{professor.name}</h1>
                        <p>{professor.college}</p>
                    </div>

                    <div className={styles.profInfoRight}>
                        {score > 0 ?
                            <>
                                <p className={styles.score}>{score}</p>
                                <span className={styles.outOf}>/5</span>
                            </>
                            :
                            <p className={styles.score}>N/A</p>}
                    </div>
                </section>


                <Suspense>
                    <ReviewForm professorEmail={professor.email} canReview={professor.canReview}/>
                </Suspense>

                <Suspense>
                    <ReviewSection professorReviews={professor.reviews}/>
                </Suspense>

            </div>
        </Layout>
    );
}
