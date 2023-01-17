import {Component, ChangeEvent} from 'react';
import person from '../assests/person.svg';


const onChangeCourse = (e: ChangeEvent<HTMLInputElement>): void => {
    const text = e.target.value;

    // TODO search for course here (autocomplete)
}

export default class Home extends Component {
    render() {
        return (
            <div className="home">
                <div id="boxes">
                    <div className="box box1">
                        <div>
                            <span className="titleIcon unselectable">
                            <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"
                                 viewBox="0 0 256 256"><path fill="currentColor"
                                                             d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h13.4a7.9 7.9 0 0 0 7.2-4.6a48.1 48.1 0 0 1 86.8 0a7.9 7.9 0 0 0 7.2 4.6H216a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16ZM104 168a32 32 0 1 1 32-32a32.1 32.1 0 0 1-32 32Zm112 32h-56.6a63.7 63.7 0 0 0-13.1-16H192a8 8 0 0 0 8-8V80a8 8 0 0 0-8-8H64a8 8 0 0 0-8 8v96a8 8 0 0 0 6 7.7A64.2 64.2 0 0 0 48.6 200H40V56h176Z"/></svg>
                        </span>
                            <span className="titleText unselectable">Search for course materials</span>
                        </div>
                        <div className="search">
                            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                      d="m18.9 20.3l-5.6-5.6q-.75.6-1.725.95Q10.6 16 9.5 16q-2.725 0-4.612-1.887Q3 12.225 3 9.5q0-2.725 1.888-4.613Q6.775 3 9.5 3t4.613 1.887Q16 6.775 16 9.5q0 1.1-.35 2.075q-.35.975-.95 1.725l5.625 5.625q.275.275.275.675t-.3.7q-.275.275-.7.275q-.425 0-.7-.275ZM9.5 14q1.875 0 3.188-1.312Q14 11.375 14 9.5q0-1.875-1.312-3.188Q11.375 5 9.5 5Q7.625 5 6.312 6.312Q5 7.625 5 9.5q0 1.875 1.312 3.188Q7.625 14 9.5 14Z"/>
                            </svg>
                            <input className="unselectable search-bar" onChange={onChangeCourse} type="text" placeholder="Search course name"/>
                        </div>
                    </div>

                    <div className="box box2">
                        <div>
                            <span className="titleIcon unselectable">
                            <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"
                                 viewBox="0 0 24 24"><path fill="currentColor"
                                                           d="M14 9.9V8.2q.825-.35 1.688-.525Q16.55 7.5 17.5 7.5q.65 0 1.275.1q.625.1 1.225.25v1.6q-.6-.225-1.212-.337Q18.175 9 17.5 9q-.95 0-1.825.238Q14.8 9.475 14 9.9Zm0 5.5v-1.7q.825-.35 1.688-.525Q16.55 13 17.5 13q.65 0 1.275.1q.625.1 1.225.25v1.6q-.6-.225-1.212-.337q-.613-.113-1.288-.113q-.95 0-1.825.225T14 15.4Zm0-2.75v-1.7q.825-.35 1.688-.525q.862-.175 1.812-.175q.65 0 1.275.1q.625.1 1.225.25v1.6q-.6-.225-1.212-.337q-.613-.113-1.288-.113q-.95 0-1.825.238q-.875.237-1.675.662ZM6.5 16q1.175 0 2.288.262q1.112.263 2.212.788V7.2q-1.025-.6-2.175-.9Q7.675 6 6.5 6q-.9 0-1.787.175Q3.825 6.35 3 6.7v9.9q.875-.3 1.738-.45Q5.6 16 6.5 16Zm6.5 1.05q1.1-.525 2.213-.788Q16.325 16 17.5 16q.9 0 1.763.15q.862.15 1.737.45V6.7q-.825-.35-1.712-.525Q18.4 6 17.5 6q-1.175 0-2.325.3q-1.15.3-2.175.9ZM12 20q-1.2-.95-2.6-1.475Q8 18 6.5 18q-1.05 0-2.062.275q-1.013.275-1.938.775q-.525.275-1.012-.025Q1 18.725 1 18.15V6.1q0-.275.138-.525q.137-.25.412-.375q1.15-.6 2.4-.9Q5.2 4 6.5 4q1.45 0 2.838.375Q10.725 4.75 12 5.5q1.275-.75 2.663-1.125Q16.05 4 17.5 4q1.3 0 2.55.3q1.25.3 2.4.9q.275.125.413.375q.137.25.137.525v12.05q0 .575-.487.875q-.488.3-1.013.025q-.925-.5-1.938-.775Q18.55 18 17.5 18q-1.5 0-2.9.525T12 20Zm-5-8.35Z"/></svg>
                        </span>
                            <span className="titleText unselectable">Find your professor</span>
                        </div>
                        <div className="search">
                            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                      d="m18.9 20.3l-5.6-5.6q-.75.6-1.725.95Q10.6 16 9.5 16q-2.725 0-4.612-1.887Q3 12.225 3 9.5q0-2.725 1.888-4.613Q6.775 3 9.5 3t4.613 1.887Q16 6.775 16 9.5q0 1.1-.35 2.075q-.35.975-.95 1.725l5.625 5.625q.275.275.275.675t-.3.7q-.275.275-.7.275q-.425 0-.7-.275ZM9.5 14q1.875 0 3.188-1.312Q14 11.375 14 9.5q0-1.875-1.312-3.188Q11.375 5 9.5 5Q7.625 5 6.312 6.312Q5 7.625 5 9.5q0 1.875 1.312 3.188Q7.625 14 9.5 14Z"/>
                            </svg>
                            <input className="unselectable search-bar" type="text" placeholder="Search professor name"/>
                        </div>
                    </div>
                </div>
                <img id="person-img" className="unselectable" draggable={false} src={person.toString()} alt=""/>
            </div>

        );
    }
}