import Box from "../components/Box";


const Home = () => {

    return (
        <div className={"home"}>
            <div className={"help-us"}>
                <p className={"alert"}>💜 Your contribution is highly appreciated!</p>
                <p>Uploading materials and rating professors will help students like you succeed in the university.</p>
            </div>
            <div className={"boxes"}>
                <Box
                    title={"Study Materials ✨"}
                    descriptions={"Share and find materials you need to help you succeed in your courses."}
                    id={"course"}/>
                <Box
                    title={"Rate a Professor ⭐"}
                    descriptions={"Learn about your professor from other students and rate their performance."}
                    id={"professor"}/>
            </div>
            <div>
                <p>What is UAEU Resources?</p>
                <p>UAEU Resources is a multi-purpose platform for UAEU students to prepare them during their
                    studies. You can find and share materials for courses that are taken by the university's students.</p>
                <p></p>
            </div>

        </div>
    );

}

export default Home;