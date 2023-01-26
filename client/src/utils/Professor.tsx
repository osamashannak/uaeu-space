import {ReactComponent as FullStar} from "../assests/star.svg";
import {ReactComponent as HalfStar} from "../assests/star-half.svg";
import {ReactComponent as EmptyStar} from "../assests/star-outline.svg";
import { formatDistance } from 'date-fns'
import {enUS, ar, da} from 'date-fns/locale'

export interface IProfessor {
    name: string,
    department: string,
    reviews: ReviewProps[]
}

export interface ReviewProps {
    author: string,
    positive: boolean,
    comment: string,
    quality: number,
    difficulty: number,
    created_at: string
}

export const ratingToIcon = (rating: number) => {

    let i;
// Round to the nearest half
    rating = Math.round(rating * 2) / 2;
    let output = [];

    // Append all the filled whole stars
    for (i = rating; i >= 1; i--)
        output.push(<FullStar/>);

    // If there is a half a star, append it
    if (i == .5) output.push(<HalfStar/>);

    // Fill the empty stars
    for (let i = (5 - rating); i >= 1; i--)
        output.push(<EmptyStar/>);

    return output;

}


export const dateHumanize = (date: string, language: string) => {
    console.log(date)
    return formatDistance(new Date(date), Date.now(), {
        includeSeconds: true,
        locale: language == "en" ? enUS : ar,
        addSuffix: true
    });
}