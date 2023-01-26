import {useParams} from "react-router-dom";


const Rate = () => {

    const { email } = useParams();

    return (
        <div>
            {email}
        </div>
    )

}

export default Rate;