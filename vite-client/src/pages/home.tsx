import styles from "../styles/pages/home.module.scss";
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import uos from "../assets/images/university/uos.png";
import uaeu from "../assets/images/university/uaeu.png";

export default function Home() {

    const navigate = useNavigate();


    return (
        <>
            <Helmet>
                <title>Home - SpaceRead</title>
            </Helmet>
            <div className={styles.timeline}>

                <div className={styles.head}>
                    <div>
                        <div className={styles.title}>
                            <span>Rate professors at your university!</span>
                        </div>
                        <div className={styles.universityList}>
                            <div className={styles.universityName}>
                                <img src={uos} alt="uos"/>
                                <span>• United Arab Emirates University</span>
                            </div>

                            <div className={styles.universityName}>
                                <span>• University of Sharjah</span>
                            </div>
                        </div>

                    </div>
                    <div className={styles.gotoBlock}>

                        <div className={styles.gotoButton} onClick={() => {
                            navigate("/professor")
                        }}>
                            <span>Rate a Professor</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
                                <path fill="currentColor"
                                      d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"/>
                            </svg>
                        </div>

                        <div className={styles.gotoButton} onClick={() => {
                            navigate("/course")
                        }}>
                            <span>Course Materials</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
                                <path fill="currentColor"
                                      d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"/>
                            </svg>
                        </div>
                    </div>

                </div>


                {/*<div>
                <TimelinePostForm/>

                <FilteredPosts/>

                <Post id={3} author={"SomeRandomName"}  comment={"How can I register for this class?"} created_at={new Date()} likes={4} dislikes={3} comments={1} self={false} selfRating={false} fadeIn={false} attachments={[]}/>
                <Post id={4} author={"SomeRandomName"}  comment={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in finibus dolor. Praesent nec dapibus nulla, nec dignissim arcu. Donec commodo id libero eu commodo. Integer et ullamcorper augue. Phasellus interdum sed sapien eu porta. In convallis, nibh vitae malesuada luctus, mi mi tincidunt nunc, et facilisis sapien urna vitae ligula. "} created_at={new Date()} likes={4} dislikes={3} comments={0} self={false} selfRating={false} fadeIn={false} attachments={[]}/>
                <Post id={5} author={"SomeRandomName"}  comment={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et risus nulla. Maecenas vehicula maximus aliquam. Fusce efficitur rhoncus sapien vitae "} created_at={new Date()} likes={4} dislikes={3} comments={1} self={false} selfRating={false} fadeIn={false} attachments={[]}/>

            </div>*/}
            </div>
        </>
    )
}