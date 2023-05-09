import {formatDistance} from "date-fns";
import {ar, enUS} from "date-fns/locale";
import {languages} from "../i18n";
import {ReactComponent as FullStar} from "../assests/star.svg";
import {ReactComponent as HalfStar} from "../assests/star-half.svg";
import {ReactComponent as EmptyStar} from "../assests/star-outline.svg";

interface IRating {
    id: number;
    positive: boolean;
    type: RatingType;
}

export enum RatingType {
    Review = "review",
    File = "file"
}

export interface IProfile {
    sessionKey: string;
    visits: string[];
    rating: [IRating];
}

export const getProfileFromSession = () => {
    return JSON.parse(sessionStorage.getItem("profile")!) as IProfile;
}

export const dateHumanize = (date: string, language: string) => {
    return formatDistance(new Date(date), Date.now(), {
        includeSeconds: true,
        locale: language === languages.en ? enUS : ar,
        addSuffix: true
    });
}

export const ratingToIcon = (rating: number) => {
    let i;
    rating = Math.round(rating * 2) / 2;
    let output = [];

    for (i = rating; i >= 1; i--) {
        output.push(<FullStar/>);
    }

    if (i === .5) {
        output.push(<HalfStar/>);
    }


    for (let i = (5 - rating); i >= 1; i--) {
        output.push(<EmptyStar/>);
    }

    return output;
}

export const generateConfetti = (id: string) => {
    const random = (max: number) => {
        return Math.random() * max;
    }
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