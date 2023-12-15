import styles from "@/styles/Professor.module.scss";
import einstein from "@/../../public/einstien.png";
import Head from 'next/head';
import Image from "next/image";
import {getProfessor} from "@/api/professor";
import ReviewForm from "@/components/Professor/ReviewForm";
import ReviewSection from "@/app/professor/ReviewSection";
import {headers} from "next/headers";
import type { Metadata } from 'next'

type Props = {
    params: { email: string }
}

export async function generateMetadata(
    {params}: Props
): Promise<Metadata> {

    const email = params.email;

    const props = await getProfessor(email);

    if (props == undefined) {
        return {
            title: `UAEU Space`,
            robots: "noindex"
        }
    }

    const mostLengthReview = props.reviews.length > 0 ? props.reviews.reduce((prev, current) => (prev.comment.length > current.comment.length) ? prev : current).comment : "";


    const reviewCount = props.reviews.length;

    return {
        title: `Discover ${props.name}'s Reviews and Ratings - UAEU Space`,
        description: mostLengthReview || `Rate ${props.name} or learn from other students about their performance.`,
        alternates: {
            canonical: `https://uaeu.space/professor/${props.email}`,
        },
        openGraph: {
            title: `${props.name} - UAEU Space`,
            description: mostLengthReview || `Rate ${props.name} or learn from other students about their performance.`,
            url: `https://uaeu.space/professor/${props.email}`,
        },
        robots: reviewCount == 0 ? "noindex" : "index"
    }

}


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

    const score = parseFloat(props.score.toFixed(1));

    return (
        <>

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