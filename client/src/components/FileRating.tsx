import {useEffect, useState} from "react";
import {Icon} from '@iconify/react';
import likeIcon from '@iconify/icons-mdi/like';
import dislikeIcon from '@iconify/icons-mdi/dislike';
import {getFileRatings, rateFile, removeFileRating} from "../api/api";

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

const LikeDislike = (props: { fileId: number }) => {
    const [liked, setLiked] = useState<boolean | null>();
    const [likes, setLikes] = useState<number>();
    const [dislikes, setDislikes] = useState<number>();

    const [running, setRunning] = useState(false);

    useEffect(() => {
        getFileRatings(props.fileId).then(value => {
            if (!value) return;
            setLikes(value.likes);
            setDislikes(value.dislikes);
        });

        const hasLiked = localStorage.getItem(`${props.fileId}-rev`);
        if (hasLiked === null) {
            setLiked(null);
            return;
        }
        setLiked(hasLiked === 'true');
    });

    const unlike = async () => {
        const likeKey = localStorage.getItem(`like-file-request-${props.fileId}`);

        if (likeKey) {
            const request = await removeFileRating(likeKey);
            if (!request) return;
            console.log(likeKey)
            localStorage.removeItem(`like-file-request-${props.fileId}`);
            localStorage.removeItem(`${props.fileId}-rev`);
        }
    }

    const unDislike = async () => {
        const dislikeKey = localStorage.getItem(`dislike-file-request-${props.fileId}`);
        if (dislikeKey) {
            const request = await removeFileRating(dislikeKey);
            if (!request) return;

            localStorage.removeItem(`dislike-file-request-${props.fileId}`);
            localStorage.removeItem(`${props.fileId}-rev`);
        }
    }

    const onLike = async () => {
        setRunning(true);

        // Remove Like
        if (liked) {
            await unlike();
            setRunning(false);
            return;
        }

        // Replace dislike to like
        if (liked === false) {
            await unDislike();
        }

        const requestKey = await rateFile(props.fileId, true);
        if (!requestKey) return;

        localStorage.setItem(`like-file-request-${props.fileId}`, requestKey);
        localStorage.setItem(`${props.fileId}-rev`, 'true');

        setRunning(false);

        generateConfetti(`like-button-${props.fileId}`);
    }

    const onDislike = async () => {
        setRunning(true);
        // Remove dislike
        if (liked === false) {
            await unDislike();
            setRunning(false);
            return;
        }

        // Replace like to dislike
        if (liked) {
            await unlike();
        }

        const requestKey = await rateFile(props.fileId, false);
        if (!requestKey) return;

        setRunning(false);

        localStorage.setItem(`${props.fileId}-rev`, 'false');
        localStorage.setItem(`dislike-file-request-${props.fileId}`, requestKey);
    }

    return (
        <div className={"ld-review-rating"}>
            <div onClick={onLike} className={"ld-rating-section"}>
                <span id={`like-button-${props.fileId}`} className={"rating-button like-button"}>
                <Icon
                    icon={likeIcon}
                    style={liked ? {color: "#007fff"} : {}}
                    className={"ld-rating-button"}/> {likes}</span>
            </div>
            <div onClick={onDislike} className={"ld-rating-section"}>
            <span className={"rating-button"}>
                <Icon
                    icon={dislikeIcon}
                    style={liked === false ? {color: "#007fff"} : {}}
                    className={"ld-rating-button"}/> {dislikes}</span>
            </div>
        </div>
    )

}

export default LikeDislike;