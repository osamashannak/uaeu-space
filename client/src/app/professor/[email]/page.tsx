import styles from "@/styles/Professor.module.scss";
import reviewStyles from "@/styles/components/Review.module.scss";
import einstein from "@/../../public/einstien.png";
import Head from 'next/head';
import Image from "next/image";
import {ProfessorAPI} from "@/interface/professor";
import {GetServerSidePropsContext, Metadata} from "next";
import {getProfessor} from "@/api/professor";
import {ResponsiveAdUnit} from "@/components/ResponsiveAdUnit";
import ReviewForm from "@/components/Professor/ReviewForm";
import Review from "@/components/Professor/Review";
import ReviewSection from "@/app/professor/ReviewSection";
import {redirect} from "next/navigation";
import {headers} from "next/headers";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";


export const metadata: Metadata = {}


const Professor = async ({params}: { params: { email: string } }) => {

    const props = await getProfessor(params.email);

    if (props == undefined) {
        return (
            <>
                <div className={styles.professorNotFound}>
                    <div>
                        <span>Professor not found :(</span>
                        <p>Please DM us on Instagram to add them to the website.</p>
                    </div>
                    <Image priority src={einstein} alt={""}/>
                </div>
            </>
        );
    }

    const mostLengthReview = props.reviews.length > 0 ? props.reviews.reduce((prev, current) => (prev.comment.length > current.comment.length) ? prev : current).comment : "";

    const score = parseFloat(props.score.toFixed(1));

    const reviewCount = props.reviews.length;

    const headersList = headers()

    console.log(headersList)

    return (
        <>
            <Head>
                <title>{`Discover ${props.name}'s Reviews and Ratings - UAEU Space`}</title>
                <meta name="description"
                      content={mostLengthReview || `Rate ${props.name} or learn from other students about their performance.`}/>
                <link rel="canonical" href={`https://uaeu.space/professor/${props.email}`}/>
                <meta property="og:title" content={`${props.name} - UAEU Space`}/>
                <meta property="og:description"
                      content={mostLengthReview || `Rate ${props.name} or learn from other students about their performance.`}/>
                <meta property="og:url" content={`https://uaeu.space/professor/${props.email}`}/>
                {reviewCount == 0 && <meta name="robots" content="noindex"/>}
            </Head>

            {/*<ResponsiveAdUnit slotId={4492620959}/>*/}

            <div className={styles.profPage}>
                <section className={styles.profInfoHead}>
                    <div className={styles.profInfoLeft}>
                        <h1>{props.name}</h1>
                        <p>{props.college}</p>
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


                <ReviewForm professorEmail={props.email}/>

                <ReviewSection professorReviews={props.reviews}/>

                {/*<ResponsiveAdUnit slotId={4212296223}/>*/}

                {/*<ResponsiveAdUnit slotId={7386567554}/>*/}

            </div>
        </>
    );
}


export default Professor;