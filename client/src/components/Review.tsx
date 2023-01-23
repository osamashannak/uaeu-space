import {ReactComponent as FulLStar} from "../assests/star.svg";

const Review = () => {
    return (
        <div className={"review"}>
            <div className={"review-info"}>
                <p className={"reviewer"}>Anonymous</p>
                <p className={"recommendation"}>Not recommended</p>
            </div>
            <div className={"review-body"}>
                <div className={"review-comment"}>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                    Aenean
                    commodo ligula eget dolor.
                    Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
                    ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
                    Nulla
                    consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate.
                </div>
                <div className={"review-scores"}>
                    <p className={"cat"}>Quality: <span className={"stars"}>
                                <FulLStar/><FulLStar/><FulLStar/><FulLStar/><FulLStar/>
                            </span></p>
                    <p className={"cat"}> Difficulty: <span className={"stars"}>
                                <FulLStar/><FulLStar/><FulLStar/><FulLStar/><FulLStar/>
                            </span></p>
                </div>
            </div>
            <p>May 15, 2021</p>
        </div>
    );
}


export default Review;