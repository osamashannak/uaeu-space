import styles from "@/styles/components/Rating.module.scss";
import {useEffect, useRef, useState} from "react";
import {generateConfetti} from "@/utils";
import {addRating, removeRating} from "@/api/shared";


const Rating = (props: { id: number, likes: number, dislikes: number, type: "review" | "file" }) => {

    const [liked, setLiked] = useState<boolean | null>();

    const [likes, setLikes] = useState<number>(0);
    const [dislikes, setDislikes] = useState<number>(0);

    const running = useRef(false);

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


    const unLike = async () => {
        const likeKey = localStorage.getItem(`like-request-${props.id}`);

        if (likeKey) {
            const request = await removeRating(likeKey, props.type);
            if (!request) return;
            console.log(likeKey)
            localStorage.removeItem(`like-request-${props.id}`);
            localStorage.removeItem(`${props.id}-rev`);
        }
    }

    const unDislike = async () => {
        const dislikeKey = localStorage.getItem(`dislike-request-${props.id}`);
        if (dislikeKey) {
            const request = await removeRating(dislikeKey, props.type);
            if (!request) return;

            localStorage.removeItem(`dislike-request-${props.id}`);
            localStorage.removeItem(`${props.id}-rev`);
        }
    }

    const onLikeClick = async () => {
        if (running.current) return;

        running.current = true;

        // Remove Like
        if (liked) {
            await unLike();
            setLiked(null);
            running.current = false;
            return;
        }

        // Replace dislike to like
        if (liked === false) {
            await unDislike();
        }

        setLiked(true);
        generateConfetti(`like-button-${props.id}`);

        const requestKey = await addRating(props.id, true, props.type);

        if (requestKey) {
            localStorage.setItem(`like-request-${props.id}`, requestKey);
            localStorage.setItem(`${props.id}-rev`, 'true');
        }

        running.current = false;
    }

    const onDislikeClick = async () => {
        if (running.current) return;

        running.current = true;

        // Remove dislike
        if (liked === false) {
            await unDislike();
            setLiked(null);
            running.current = false;
            return;
        }

        // Replace like to dislike
        if (liked) {
            await unLike();
        }

        setLiked(false);

        const requestKey = await addRating(props.id, false, props.type);

        if (requestKey) {
            localStorage.setItem(`${props.id}-rev`, 'false');
            localStorage.setItem(`dislike-request-${props.id}`, requestKey);
        }

        running.current = false;
    }


    return (
        <>
            <div className={styles.rating} onClick={onLikeClick} title={"Like"}>
                <span id={`like-button-${props.id}`} className={styles.buttonWrapper}>
                    <svg className={styles.ratingIcon} xmlns="http://www.w3.org/2000/svg"
                         width="14px" height="14px"
                         style={liked ? {color: "#007fff"} : {}}
                         viewBox="0 0 24 24">
                    <path fill="currentColor"
                          d="M23 10a2 2 0 0 0-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2M1 21h4V9H1v12Z"/>
                </svg>
                    &nbsp;{likes + (liked ? 1 : 0)}
                </span>
            </div>
            &nbsp;
            <div className={styles.rating} onClick={onDislikeClick} title={"Dislike"}>
                <svg className={styles.ratingIcon} xmlns="http://www.w3.org/2000/svg" width="14px" height="14px"
                     viewBox="0 0 24 24"
                     style={liked === false ? {color: "#007fff"} : {}}>
                    <path fill="currentColor"
                          d="M19 15h4V3h-4m-4 0H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2a2 2 0 0 0 2 2h6.31l-.95 4.57c-.02.1-.03.2-.03.31c0 .42.17.79.44 1.06L9.83 23l6.58-6.59c.37-.36.59-.86.59-1.41V5a2 2 0 0 0-2-2Z"/>
                </svg>
                &nbsp;{dislikes + (liked == false ? 1 : 0)}
            </div>
        </>
    );
}

export default Rating;