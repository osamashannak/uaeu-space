import {useEffect, useState} from "react";
import {ReactComponent as Like} from "../assests/like.svg";
import {ReactComponent as Dislike} from "../assests/dislike.svg";
import {getReviewRatings, rateReview, removeReview} from "../api/api";

const random = (max: number) => {
    return Math.random() * max;
}

const generateConfetti = (id: string) => {

    const c = document.createDocumentFragment();
    for (let i = 0; i < 10; i++) {
        const styles = 'transform: translate3d(' + (random(100) - 50) + 'px, ' + (random(100) - 50) + 'px, 0) rotate(' + random(360) + 'deg);\
                  background: hsla(' + random(360) + ',100%,50%,1);\
                  animation: bang 500ms ease-out forwards;\
                  opacity: 0';

        const e = document.createElement("i");
        e.style.cssText = styles.toString();
        e.className = "confetti";

        c.appendChild(e);
    }

    const element = document.getElementById(id)!;
    element.appendChild(c);

    setTimeout(() => {
        document.querySelectorAll(".confetti").forEach(function (c) {
            c.parentNode!.removeChild(c);
        });

    }, 200);
}

const LikeDislike = (props: { id: number }) => {
    const [liked, setLiked] = useState<boolean | null>();
    const [likes, setLikes] = useState<number>(0);
    const [dislikes, setDislikes] = useState<number>(0);

    const [running, setRunning] = useState(false);

    useEffect(() => {
        getReviewRatings(props.id).then(value => {
            if (!value) return;
            setLikes(value.likes);
            setDislikes(value.dislikes);
        });

        const hasLiked = localStorage.getItem(`${props.id}-rev`);
        if (hasLiked === null) {
            setLiked(null);
            return;
        }
        setLiked(hasLiked === 'true');
    });

    const unlike = async () => {
        const likeKey = localStorage.getItem(`like-request`);

        if (likeKey) {
            const request = await removeReview(likeKey);
            if (!request) return;
            console.log(likeKey)
            localStorage.removeItem(`like-request`);
            localStorage.removeItem(`${props.id}-rev`);
        }
    }

    const unDislike = async () => {
        const dislikeKey = localStorage.getItem(`dislike-request`);
        if (dislikeKey) {
            const request = await removeReview(dislikeKey);
            if (!request) return;

            localStorage.removeItem(`dislike-request`);
            localStorage.removeItem(`${props.id}-rev`);
        }
    }

    const onLike = async () => {
        setRunning(true);

        // Remove Like
        if (liked) {
            await unlike();
            return;
        }

        // Replace dislike to like
        if (liked === false) {
            await unDislike();
        }

        const requestKey = await rateReview(props.id, true);
        if (!requestKey) return;

        localStorage.setItem(`like-request`, requestKey);
        localStorage.setItem(`${props.id}-rev`, 'true');

        setRunning(false);

        generateConfetti(`like-button-${props.id}`);
    }

    const onDislike = async () => {
        setRunning(true);
        // Remove dislike
        if (liked === false) {
            await unDislike();
            return;
        }

        // Replace like to dislike
        if (liked) {
            await unlike();
        }

        const requestKey = await rateReview(props.id, false);
        if (!requestKey) return;

        setRunning(false);

        localStorage.setItem(`${props.id}-rev`, 'false');
        localStorage.setItem(`dislike-request`, requestKey);
    }

    return (
        <div className={"review-rating"}>
            <span id={`like-button-${props.id}`} className={"rating-button like-button"}><Like
                onClick={onLike}
                style={liked ? {color: "#007fff"} : {}}
                className={"review-rating-button"}/> {likes}</span>
            <span className={"rating-button"}><Dislike
                onClick={onDislike}
                style={liked === false ? {color: "#007fff"} : {}}
                className={"review-rating-button"}/> {dislikes}</span>
        </div>
    )

}

export default LikeDislike;