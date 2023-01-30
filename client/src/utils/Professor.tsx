import {ReactComponent as FullStar} from "../assests/star.svg";
import {ReactComponent as HalfStar} from "../assests/star-half.svg";
import {ReactComponent as EmptyStar} from "../assests/star-outline.svg";
import {formatDistance} from 'date-fns'
import {ar, enUS} from 'date-fns/locale'
import {ProfData} from "./SearchBox";

export interface IProfessor extends ProfData{
    college: string,
    reviews: IReview[]
}

export interface IReview {
    author: string,
    positive: boolean,
    comment: string,
    score: number,
    created_at: string
}

export const ratingToIcon = (rating: number) => {

    let i;

    rating = Math.round(rating * 2) / 2;
    let output = [];

    for (i = rating; i >= 1; i--)
        output.push(<FullStar/>);

    if (i === .5) output.push(<HalfStar/>);


    for (let i = (5 - rating); i >= 1; i--)
        output.push(<EmptyStar/>);

    return output;

}