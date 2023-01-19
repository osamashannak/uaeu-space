//import SearchBox from "./SearchBox";

interface BoxProps {
    title: string,
    descriptions: string,
    id: string
}

const Box = (props: BoxProps) => {

    return (
        <div className={"box"}>
            <div>
                <p className={"box-title"}>{props.title}</p>
                <p className={"box-description"}>{props.descriptions}</p>
            </div>
            {/*<SearchBox id={props.id}/>*/}
        </div>
    );

}


export default Box;