import styles from "@/styles/Professor.module.scss";
import reviewStyles from "@/styles/components/Review.module.scss";
import einstein from "../../../public/einstien.png";
import Head from 'next/head';
import Image from "next/image";
import {ProfessorAPI} from "@/interface/professor";
import {GetServerSidePropsContext} from "next";
import {getProfessor} from "@/api/professor";
import {ResponsiveAdUnit} from "@/components/ResponsiveAdUnit";
import ReviewForm from "@/components/Professor/ReviewForm";
import Review from "@/components/Professor/Review";
import {useEffect, useState} from "react";

enum SORT_BY {
    rated,
    newest
}
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

    const [sortHidden, setSortHidden] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<SORT_BY>(SORT_BY.newest);
    const [reviews, setReviews] = useState(props.reviews);

    useEffect(() => {
        if (reviews == null) {
            return;
        }

        if (sortBy === SORT_BY.newest) {
            setReviews(reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } else {
            setReviews(reviews.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes)));
        }
    }, [reviews, sortBy]);

    const mostLengthReview = props.reviews.length > 0 ? props.reviews.reduce((prev, current) => (prev.comment.length > current.comment.length) ? prev : current).comment : "";

    const score = parseFloat(props.score.toFixed(1));

    const reviewCount = props.reviews.length;

    if (typeof window !== "undefined") {
        window.onclick = function () {
            if (!sortHidden) {
                setSortHidden(true);
            }
        }
    }

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

                <div className={styles.commentsSection}>
                    <div className={styles.sortButtonWrapper}>
                        <div className={styles.sortButton}
                             onClick={(event) => {
                                 event.stopPropagation()
                                 setSortHidden(!sortHidden);
                             }}>
                            <div className={styles.sortIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                          d="M4 18h4c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1zm1 6h10c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1z"/>
                                </svg>
                                <div className={styles.sortIconBackground}></div>
                            </div>
                            <span>Sort by</span>
                        </div>
                    </div>

                    <div hidden={sortHidden} className={styles.sortByMenu}>
                        <div className={styles.sortByMenuList}>
                            <div className={styles.sortByListItem}
                                 onClick={() => {
                                     setSortBy(SORT_BY.rated);
                                 }}>
                                <span>Rated</span>
                            </div>
                            <div className={styles.sortByListItem}
                                 onClick={() => {
                                     setSortBy(SORT_BY.newest);
                                 }}>
                                <span>Newest</span>
                            </div>
                        </div>
                    </div>

                    <section>
                        {
                            reviewCount > 0 ? props.reviews.map((review) => (
                                <>
                                    <Review key={review.id} {...review}/>
                                    {/*{Math.floor(reviewCount / 2) === index &&
                                    <ResponsiveAdUnit slotId={8705186952}/>}*/}
                                </>
                            )) : <p className={reviewStyles.review}>{"There are no comments."}</p>
                        }
                    </section>
                </div>

                {/*<ResponsiveAdUnit slotId={4212296223}/>*/}

                {/*<ResponsiveAdUnit slotId={7386567554}/>*/}

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