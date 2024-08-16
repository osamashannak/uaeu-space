import styles from "../styles/pages/home.module.scss";
import {useNavigate} from "react-router-dom";
import TimelinePostForm from "../components/timeline/post_form.tsx";
import Post from "../components/timeline/post.tsx";
import FilteredPosts from "../components/timeline/filtered_posts.tsx";

export default function Home() {

    const navigate = useNavigate();


    return (
        <div className={styles.timeline}>

            <div className={styles.head}>
                <div>
                    <div className={styles.title}>
                        <span>We now support more universities!</span>
                    </div>
                    <div className={styles.universityList}>
                        {/*<div className={styles.universityName}>
                            <span>• Khalifa University</span>
                        </div>*/}

                        <div className={styles.universityName}>
                            <span>• University of Sharjah</span>
                            <div className={styles.gotoBlock}>

                                <div className={styles.gotoButton} onClick={() => {
                                    navigate("/professor")
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                                         viewBox="0 0 15 15">
                                        <path fill="currentColor"
                                              d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"/>
                                    </svg>
                                    <span>Rate a Professor</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


            </div>


            <div>
                <TimelinePostForm/>
            </div>

            <FilteredPosts/>

            <Post id={3} author={"SomeRandomName"}  comment={"How can I register for this class?"} created_at={new Date()} likes={4} dislikes={3} comments={1} self={false} selfRating={false} fadeIn={false} attachments={[]}/>
            <Post id={4} author={"SomeRandomName"}  comment={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in finibus dolor. Praesent nec dapibus nulla, nec dignissim arcu. Donec commodo id libero eu commodo. Integer et ullamcorper augue. Phasellus interdum sed sapien eu porta. In convallis, nibh vitae malesuada luctus, mi mi tincidunt nunc, et facilisis sapien urna vitae ligula. "} created_at={new Date()} likes={4} dislikes={3} comments={0} self={false} selfRating={false} fadeIn={false} attachments={[]}/>
            <Post id={5} author={"SomeRandomName"}  comment={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et risus nulla. Maecenas vehicula maximus aliquam. Fusce efficitur rhoncus sapien vitae "} created_at={new Date()} likes={4} dislikes={3} comments={1} self={false} selfRating={false} fadeIn={false} attachments={[]}/>

        </div>
    )
}