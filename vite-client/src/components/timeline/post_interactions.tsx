import {useRef, useState} from "react";
import styles from "../../styles/components/timeline/post_interactions.module.scss";
import {addRating, removeRating} from "../../api/professor.ts";

export default function PostInteractions(props: { id: number, likes: number, self: boolean | null, comments: number }) {

    const [liked, setLiked] = useState<boolean | null>(props.self);

    const running = useRef(false);

    const onLikeClick = async () => {
        if (running.current) return;

        running.current = true;

        // Remove Like
        if (liked) {
            setLiked(null);
            await removeRating(props.id);
            running.current = false;
            return;
        }

        // Replace dislike to like
        if (liked === false) {
            await removeRating(props.id);
        }

        setLiked(true);

        await addRating(props.id, true);

        running.current = false;
    }

    const likeCount = (props.likes + (liked ? 1 : 0) - (props.self ? 1 : 0));

    function likeRatingClick(id: number) {
        return {
            onMouseDown: () => {
                const likeButton = document.getElementById(`like-button-${id}`);
                likeButton?.classList.add(styles.ratingClick);
            },
            onMouseUp: () => {
                const likeButton = document.getElementById(`like-button-${id}`);
                likeButton?.classList.remove(styles.ratingClick);
                const bg = document.getElementById(`bg-like-${id}`);
                bg?.classList.remove(styles.ratingIconBgHover)
            },
            onMouseOut: () => {
                const likeButton = document.getElementById(`like-button-${id}`);
                likeButton?.classList.remove(styles.ratingClick);
                const bg = document.getElementById(`bg-like-${id}`);
                bg?.classList.remove(styles.ratingIconBgHover)
            }
        }
    }

    function hoverShowBg(id: string) {
        return {
            onMouseEnter: () => {
                const bg = document.getElementById(id);
                bg?.classList.add(styles.ratingIconBgHover);
            },
            onMouseLeave: () => {
                const bg = document.getElementById(id);
                bg?.classList.remove(styles.ratingIconBgHover);
            }
        }
    }

    return (
        <>
            <div className={styles.rating}>
                <div className={styles.like} title={"Like"}>
                    <div id={`like-button-${props.id}`} onClick={onLikeClick} {...likeRatingClick(props.id)}
                         className={styles.buttonWrapper}>
                        {liked ?
                            <svg className={styles.filledRatingIcon} xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 24 24">
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
                        <div id={`bg-like-${props.id}`} className={styles.ratingIconBg}></div>
                    </div>
                    <div className={styles.ratingCountWrapper}>
                        {likeCount > 0 ?
                            <span className={styles.ratingCount} {...hoverShowBg(`bg-like-${props.id}`)}
                                  onClick={onLikeClick} {...likeRatingClick(props.id)}>{likeCount || ""}</span> :
                            <span className={styles.emptyRatingCount}></span>}
                    </div>
                </div>
            </div>
            <div className={styles.comment} onClick={() => {
                /*showReplyCompose(true);*/
            }} onMouseDown={(e) => {
                e.currentTarget.classList.add(styles.buttonClick);
            }} onMouseUp={(e) => {
                e.currentTarget.classList.remove(styles.buttonClick);
            }} onMouseOut={(e) => {
                e.currentTarget.classList.remove(styles.buttonClick);
            }}>
                <div className={styles.commentButton}>
                    <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.89 1 4.127L3 21l4.873-1c1.236.639 2.64 1 4.127 1"/>
                    </svg>
                    <div className={styles.iconBackground}></div>
                </div>
                {props.comments > 0 && <span className={styles.commentCount}>{props.comments}</span>}
            </div>
        </>
    );
}
