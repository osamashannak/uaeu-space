import styles from "@/styles/Professor.module.scss";
import Review from "@/components/Review";
import ReviewForm from "@/components/ReviewForm";
import reviewStyles from "@/styles/components/Review.module.scss";
import einstein from "../../../public/einstien.png";
import Head from 'next/head';
import Image from "next/image";
import {ProfessorAPI} from "@/interface/professor";
import {GetServerSidePropsContext} from "next";
import {getProfessor} from "@/api/professor";
import {ResponsiveAdUnit} from "@/components/ResponsiveAdUnit";
import {MultiplexAd} from "@/components/MultiplexAd";

const Professor = (props: ProfessorAPI | {}) => {

    if (!('name' in props)) {
        return (
            <>
                <Head>
                    <title>UAEU Space</title>
                    <meta name="robots" content="noindex"/>
                </Head>
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


    return (
        <>
            <Head>
                <title>{`Discover ${props.name}&apos;s Reviews and Ratings - UAEU Space`}</title>
                <meta name="description"
                      content={mostLengthReview || `Rate ${props.name} or learn from other students about their performance.`}/>
                <link rel="canonical" href={`https://uaeu.space/professor/${props.email}`}/>
                <meta property="og:title" content={`${props.name} - UAEU Space`}/>
                <meta property="og:description"
                      content={mostLengthReview || `Rate ${props.name} or learn from other students about their performance.`}/>
                <meta property="og:url" content={`https://uaeu.space/professor/${props.email}`}/>
                {reviewCount == 0 && <meta name="robots" content="noindex"/>}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: `
                    {
                      "@context": "https://schema.org/",
                      "@type": "LocalBusiness",
                      "name": "${props.name}",
                      "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "${score}",
                        "ratingCount": "${reviewCount}"
                      },
                      "review": ${JSON.stringify(props.reviews.map(review => ({
                            "@type": "Review",
                            reviewRating: {
                                "@type": "Rating",
                                ratingValue: String(review.score)
                            },
                            author: {
                                "@type": "Person",
                                name: review.author
                            },
                            reviewBody: review.comment,
                            datePublished: review.created_at
                        })))}
                    }
                    `,
                    }}
                />
            </Head>
            <div className={styles.profPage}>
                <section className={styles.profInfoHead}>
                    <div className={styles.profInfoLeft}>
                        <h1>{props.name}</h1>
                        <p>{props.college}</p>
                    </div>

                    <div className={styles.profInfoRight}>
                        {score > 0 ? <p>{score}<span className={"score-out-of"}>/5</span></p> : <p>N/A</p>}
                    </div>
                </section>

                <ResponsiveAdUnit slotId={4212296223}/>

                <section className={styles.commentsSection}>
                    {
                        reviewCount > 0 ? props.reviews.map((review, index) => (
                            <>
                                <Review key={review.id} {...review}/>
                                {Math.floor(reviewCount / 2) === index &&
                                    <ResponsiveAdUnit slotId={8705186952}/>
                                }
                            </>
                        )) : <p className={reviewStyles.review}>{"There are no comments."}</p>
                    }
                </section>

                <ResponsiveAdUnit slotId={7386567554}/>

                <ReviewForm professorEmail={props.email}/>

                <MultiplexAd slotId={9040352589} style={{marginTop: "1rem"}}/>
            </div>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const {email} = context.query;
    const data = await getProfessor(email as string);
    if (data == undefined) {
        context.res.statusCode = 404;
    }
    return {
        props: data ?? {}
    }
}


export default Professor;