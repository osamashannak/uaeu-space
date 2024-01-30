import Layout from "../layouts/layout.tsx";
import einstein from "../assets/einstien.png";
import {lazy, useEffect, useState} from "react";
import styles from "../styles/pages/professor.module.scss";
import {getProfessor} from "../api/professor.ts";
import {useParams} from "react-router-dom";
import {ProfessorAPI} from "../typed/professor.ts";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

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
    const [professor, setProfessor] = useState<ProfessorAPI | undefined | null>();
    const {email} = useParams();

    useEffect(() => {
        if (!email) {
            setProfessor(null);
            return;
        }

        getProfessor(email).then((professor) => {
            setProfessor(professor);
        })

    }, [email]);

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


                <ReviewForm professorEmail={professor.email}/>

                <ReviewSection professorReviews={professor.reviews}/>

            </div>
        </Layout>
    );
}
