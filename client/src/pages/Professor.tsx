import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ReactComponent as FulLStar} from "../assests/star.svg";
import {ReactComponent as ReviewIcon} from "../assests/rate-review-outline-rounded.svg";
import Review from "../components/Review";

interface IProfessor {
    name: string,
    department: string
}

const Professor = () => {

    const {email} = useParams();
    const [prof, setProf] = useState<IProfessor>({department: "College of IT", name: "First Middle Last"});

    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: "smooth"});
    })

    return (
        <div className={"professor"}>

            <div className={"prof-info-page"}>

                <div className={"prof-info-head"}>
                    <div className={"prof-info"}>
                        <p className={"prof-name"}>{prof.name}</p>
                        <p className={"department"}>{prof.department}</p>
                    </div>

                    <div className={"prof-overall"}>
                        <p className={"overall-score"}>5<span className={"score-out-of"}>/5</span></p>

                        <div>
                            <p className={"rating-category"}>Quality: <span className={"stars"}>
                                <FulLStar/><FulLStar/><FulLStar/><FulLStar/><FulLStar/>
                            </span>
                            </p>

                            <p className={"rating-category"}>Difficulty: <span className={"stars"}>
                                <FulLStar/><FulLStar/><FulLStar/><FulLStar/><FulLStar/>
                            </span>
                            </p>
                        </div>

                    </div>
                </div>

                <div className={"ratings-section"}>
                    <p className={"ratings-title"}><ReviewIcon className={"review-icon"}/> Reviews</p>
                    <Review/>
                    <Review/>
                    <Review/>
                    <Review/>
                    <Review/>
                    <Review/>
                </div>

            </div>


        </div>
    )
}

export default Professor;