import {Link} from "react-router-dom";

(
    <div>
        <label className={"icon-label"}>
            <input list={"auto-suggest"} className={"search-bar"} type={"text"}
                   placeholder={`Search ${props.id} name`}/>
        </label>

        <p><Link className={"help-course"} to={'/report'}>I can't find my {props.id}!</Link></p>
    </div>
)