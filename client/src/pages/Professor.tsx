import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {IProfessor} from "../utils/Professor";
import {getProfessor} from "../api/api";
import ProfessorNotFound from "../components/ProfessorNotFound";
import ProfessorBlock from "../components/ProfessorBlock";

const Professor = () => {

    const {email} = useParams();

    const [professor, setProfessor] = useState<IProfessor>();

    useEffect(() => {

        if (!email) return;

        getProfessor(email).then(prof => {
            if (!prof) return;

            setProfessor(prof);
        })

        window.scrollTo({top: 0, left: 0});

    }, [])

    return (
        <div className={"professor"}>

            <div className={"prof-info-page"}>

                {professor ? <ProfessorBlock {...professor}/> : <ProfessorNotFound/>}

            </div>


        </div>
    )
}

export default Professor;