import Box from "../components/Box";


const Home = () => {

    return (
        <div className={"home"}>
            <div className={"help-us"}>
                <p className={"alert"}>❗ Your contribution is highly appreciated!</p>
                <p>Uploading materials and rating professors will help students like you succeed in the university.</p>
            </div>
            <div className={"boxes"}>
                <Box
                    title={"Study Materials ✨"}
                    descriptions={"Share and find materials you need to help you succeed in your courses."}
                    id={"course"}/>
                <Box
                    title={"Rate a Professor ⭐"}
                    descriptions={"Rate and find a professor's performance."}
                    id={"professor"}/>
            </div>

        </div>
    );

}

export default Home;