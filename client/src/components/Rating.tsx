import {useEffect, useState} from "react";
import {Icon} from '@iconify/react';
import likeIcon from '@iconify/icons-mdi/like';
import dislikeIcon from "@iconify/icons-mdi/dislike";
import {generateConfetti, IProfile, RatingType} from "../utils/Global";
import {addRating} from "../api/api";

const Rating = (props: { id: number, likes: number, dislikes: number, type: RatingType }) => {
    const [liked, setLiked] = useState<boolean | undefined>();
    const [running, setRunning] = useState(false);

    useEffect(() => {
        const profile = JSON.parse(sessionStorage.getItem('profile')!) as IProfile;

        const rating = profile.reviewsRating.find((r) => r.id === props.id);

        setLiked(rating?.positive);
    }, []);

    const onLike = async () => {
        if (running) return;
        setRunning(true);

        if (liked == null || !liked) {
            setLiked(true);
            generateConfetti(`like-button-${props.id}`);
        }

        const clientKey = localStorage.getItem("clientKey");

        const response = await addRating(props.id, true, props.type, clientKey!);

        if (!response) return;

        const profile = JSON.parse(sessionStorage.getItem('profile')!) as IProfile;


        setRunning(false);
    }

    const onDislike = async () => {
        if (running) return;
        setRunning(true);

        if (liked == null || liked) {
            setLiked(false);
        }

        const clientKey = localStorage.getItem("clientKey");

        const response = await addRating(props.id, false, props.type, clientKey!);

        if (!response) return;

        setRunning(false);
    }

    return (
        <div className={"ld-review-rating"}>
            <div onClick={onLike} className={"ld-rating-section"}>
                <span id={`like-button-${props.id}`} className={"rating-button like-button"}>
                <Icon
                    icon={likeIcon}
                    style={liked ? {color: "#007fff"} : {}}
                    className={"ld-rating-button"}/> {props.likes + (liked ? 1 : 0)}</span>
            </div>
            <div onClick={onDislike} className={"ld-rating-section"}>
                <span id="dislike-button" className={"rating-button"}>
                <Icon
                    icon={dislikeIcon}
                    style={liked === false ? {color: "#007fff"} : {}}
                    className={"ld-rating-button"}/> {props.dislikes + (liked === false ? 1 : 0)}</span>
            </div>
        </div>
    )

}

export default Rating;