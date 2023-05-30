import {useEffect, useRef, useState} from "react";
import styles from "@/styles/Dashboard.module.scss";
import {getPendingReviews, getProfessorReviews, reviewAction} from "@/api/dashboard";
import {DashboardReviewAPI} from "@/interface/dashboard";
import NProgress from "nprogress";
import Review from "@/components/Professor/Review";

const PendingReviews = (props: {professor: string | null}) => {

    const [reviews, setReviews] = useState<DashboardReviewAPI[]>();
    const previousProfessor = useRef(props.professor);

    useEffect(() => {
        if (!props.professor) return;
        
        const token = sessionStorage.getItem("token")!;
        getProfessorReviews(token, props.professor).then((data) => {
            setReviews(data == undefined ? [] : data);
        });
        
    }, [props.professor]);

    useEffect(() => {
        if (props.professor) return;

        
        if (!reviews || reviews.length === 0 || (previousProfessor.current !== null && props.professor === null)) {
            const token = sessionStorage.getItem("token")!;
            getPendingReviews(token).then((data) => {
                setReviews(data == undefined ? [] : data);
            });
        }
    }, [props.professor, reviews]);

    useEffect(() => {
        previousProfessor.current = props.professor;
    }, [props.professor]);

    const reviewActionClick = (id: number, action: "approve" | "hide") => {
        return () => {
            NProgress.start();
            const token = sessionStorage.getItem("token")!;
            reviewAction(id, action, token).then(() => {
                NProgress.done();
                if (props.professor) {
                    // set review to visible in the list
                    setReviews(reviews!.map(review => {
                        if (review.id === id) {
                            review.reviewed = true;
                        }
                        return review;
                    }));
                    return;
                }
                setReviews(reviews!.filter(review => review.id !== id));
            })
        }
    }

    const professorPageClick = (email: string) => {
        return () => {
            window.open(`/professor/${email}`, "_blank");
        }
    }

    if (reviews == undefined) {
        return (
            <p>Loading...</p>
        )
    }

    if (reviews.length === 0) {
        return (
            <p>There are no comments pending for review.</p>
        )
    }

    return (
        <>
            {
                reviews.map((review, index) => (
                    <div key={index}>
                        <Review {...review}/>
                        <span>{review.id} | {review.professor.name} | {review.professor.email} | {review.author_ip ?? "Legacy"}</span>
                        <div>&nbsp;</div>
                        {!review.reviewed && <div className={styles.buttons}>
                            <div className={styles.approveButton}
                                 onClick={reviewActionClick(review.id, "approve")}>Approve
                            </div>
                            <div className={styles.hideButton} onClick={reviewActionClick(review.id, "hide")}>Hide</div>
                            <div onClick={professorPageClick(review.professor.email)} className={styles.downloadButton}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth="2"
                                          d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6m-7 1l9-9m-5 0h5v5"/>
                                </svg>
                            </div>
                        </div>}
                    </div>
                ))
            }
        </>
    )
}

export default PendingReviews;