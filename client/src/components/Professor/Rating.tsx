import styles from "@/styles/components/Rating.module.scss";
import {useEffect, useState} from "react";


const Rating = (props: { id: number, likes: number, dislikes: number, type: "review" | "file" }) => {

    const [liked, setLiked] = useState<boolean | null>();

    const [likes, setLikes] = useState<number>(0);
    const [dislikes, setDislikes] = useState<number>(0);


    useEffect(() => {
        const hasLiked = localStorage.getItem(`${props.id}-rev`);
        if (hasLiked == null) {
            setLiked(null);
        } else {
            setLiked(hasLiked === 'true');
        }
        setLikes(props.likes - (hasLiked === 'true' ? 1 : 0));
        setDislikes(props.dislikes - (hasLiked === 'false' ? 1 : 0));
    }, [props.dislikes, props.id, props.likes]);


    return (
        <div className={styles.rating}>
            <div className={styles.like} title={"Like"}>
                <div id={`like-button-${props.id}`} className={styles.buttonWrapper}>
                    {liked ?
                        <svg className={styles.filledRatingIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor" fillRule="evenodd"
                                  d="M11.277 4.781A4 4 0 0 1 14.606 3h.213a2 2 0 0 1 1.973 2.329L16.18 9h2.38a3 3 0 0 1 2.942 3.588l-1.2 6A3 3 0 0 1 17.36 21H6a3 3 0 0 1-3-3v-8a1 1 0 0 1 1-1h3.93a1 1 0 0 0 .832-.445l2.515-3.774ZM7 11H5v7a1 1 0 0 0 1 1h1v-8Z"
                                  clipRule="evenodd"/>
                        </svg> :
                        <svg className={styles.ratingIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g>
                                <path fill="currentColor"
                                      d="m15 10l-.493-.082A.5.5 0 0 0 15 10.5V10ZM4 10v-.5a.5.5 0 0 0-.5.5H4Zm16.522 2.392l.49.098l-.49-.098ZM6 20.5h11.36v-1H6v1Zm12.56-11H15v1h3.56v-1Zm-3.067.582l.806-4.835l-.986-.165l-.806 4.836l.986.164ZM14.82 3.5h-.213v1h.213v-1Zm-3.126 1.559L9.178 8.832l.832.555l2.515-3.774l-.832-.554ZM7.93 9.5H4v1h3.93v-1ZM3.5 10v8h1v-8h-1Zm16.312 8.49l1.2-6l-.98-.196l-1.2 6l.98.196ZM9.178 8.832A1.5 1.5 0 0 1 7.93 9.5v1a2.5 2.5 0 0 0 2.08-1.113l-.832-.555Zm7.121-3.585A1.5 1.5 0 0 0 14.82 3.5v1a.5.5 0 0 1 .494.582l.986.165ZM18.56 10.5a1.5 1.5 0 0 1 1.471 1.794l.98.196a2.5 2.5 0 0 0-2.45-2.99v1Zm-1.2 10a2.5 2.5 0 0 0 2.452-2.01l-.98-.196A1.5 1.5 0 0 1 17.36 19.5v1Zm-2.754-17a3.5 3.5 0 0 0-2.913 1.559l.832.554a2.5 2.5 0 0 1 2.08-1.113v-1ZM6 19.5A1.5 1.5 0 0 1 4.5 18h-1A2.5 2.5 0 0 0 6 20.5v-1Z"/>
                                <path stroke="currentColor" d="M8 10v10"/>
                            </g>
                        </svg>}
                    <div className={styles.ratingIconBg}></div>
                </div>
                <span className={styles.ratingCount}>{likes + (liked ? 1 : 0)}</span>
            </div>
            <div className={styles.dislike} title={"Dislike"}>
                <div className={styles.buttonWrapper}>
                    {liked === false ?
                        <svg className={styles.filledRatingIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor" fillRule="evenodd"
                                  d="M11.277 19.219A4 4 0 0 0 14.606 21h.213a2 2 0 0 0 1.973-2.329L16.18 15h2.38a3 3 0 0 0 2.942-3.588l-1.2-6A3 3 0 0 0 17.36 3H6a3 3 0 0 0-3 3v8a1 1 0 0 0 1 1h3.93a1 1 0 0 1 .832.445l2.515 3.774ZM7 5v8H5V6a1 1 0 0 1 1-1h1Z"
                                  clipRule="evenodd"/>
                        </svg> :
                        <svg className={styles.ratingIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g>
                                <path fill="currentColor"
                                      d="m15 14l-.493.082A.5.5 0 0 1 15 13.5v.5ZM4 14v.5a.5.5 0 0 1-.5-.5H4Zm16.522-2.392l.49-.098l-.49.098ZM6 3.5h11.36v1H6v-1Zm12.56 11H15v-1h3.56v1Zm-3.067-.582l.806 4.835l-.986.165l-.806-4.836l.986-.164ZM14.82 20.5h-.213v-1h.213v1Zm-3.126-1.558l-2.515-3.774l.832-.555l2.515 3.774l-.832.555ZM7.93 14.5H4v-1h3.93v1ZM3.5 14V6h1v8h-1Zm16.312-8.49l1.2 6l-.98.196l-1.2-6l.98-.196ZM9.178 15.168A1.5 1.5 0 0 0 7.93 14.5v-1a2.5 2.5 0 0 1 2.08 1.113l-.832.555Zm7.121 3.585a1.5 1.5 0 0 1-1.48 1.747v-1a.5.5 0 0 0 .494-.582l.986-.165ZM18.56 13.5a1.5 1.5 0 0 0 1.471-1.794l.98-.196a2.5 2.5 0 0 1-2.45 2.99v-1Zm-1.2-10a2.5 2.5 0 0 1 2.452 2.01l-.98.196A1.5 1.5 0 0 0 17.36 4.5v-1Zm-2.754 17a3.5 3.5 0 0 1-2.913-1.558l.832-.555a2.5 2.5 0 0 0 2.08 1.113v1ZM6 4.5A1.5 1.5 0 0 0 4.5 6h-1A2.5 2.5 0 0 1 6 3.5v1Z"/>
                                <path stroke="currentColor" d="M8 14V4"/>
                            </g>
                        </svg>}
                    <div className={styles.ratingIconBg}></div>
                </div>
                <span className={styles.ratingCount}>{dislikes + (liked == false ? 1 : 0)}</span>
            </div>
        </div>
    )
        ;
}

export default Rating;