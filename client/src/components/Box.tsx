import SearchBoxElement from "./SearchBox";
import {SearchBoxProps} from "../utils/SearchBox";

interface BoxProps {
    title: string,
    descriptions: string,
    searchBoxProps: SearchBoxProps
}

const Box = (props: BoxProps) => {

    return (
        <div className={"box"}>
            <div>
                <p className={"box-title"}>{props.title}</p>
                <p className={"box-description"}>{props.descriptions}</p>
            </div>

            {props.searchBoxProps.type === 'course' ?
                <SearchBoxElement type={props.searchBoxProps.type}/> :
                <SearchBoxElement type={props.searchBoxProps.type}/>
            }
        </div>
    );

}


export default Box;