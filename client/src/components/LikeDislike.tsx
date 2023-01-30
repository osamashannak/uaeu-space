import {useEffect} from "react";
import {ReactComponent as Like} from "../assests/like.svg";
import {ReactComponent as Dislike} from "../assests/dislike.svg";



const LikeDislike = () => {

    useEffect(() => {

    }, []);

    return (
        <div className={"review-rating"}>
            <span className={"rating-button"}><Like
                className={"review-rating-button"}/> 4</span>
            <span className={"rating-button"}><Dislike
                className={"review-rating-button"}/> 100</span>
        </div>
    )

}

export default LikeDislike;