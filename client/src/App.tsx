import React, {useEffect} from 'react';
import NavBar from "./components/NavBar";
import "./normalize.css";
import Footer from "./components/Footer";
import {useTranslation} from "react-i18next";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Course from "./pages/Course";
import Professor from "./pages/Professor";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import {Helmet} from "react-helmet";
import {auth, getProfile} from "./api/api";
import {GoogleReCaptchaProvider} from 'react-google-recaptcha-v3';

const App = () => {
    const [ready, setReady] = React.useState<boolean>(false);
    const {t, i18n} = useTranslation();
    document.body.dir = i18n.dir();

    const storeClientKey = () => {
        const migrationData = [];

        for (let i = 0; i < localStorage.length; i++) {
            const data = localStorage.key(i)!;
            if (data.endsWith("-exist")) {
                migrationData.push(data);
            } else if (data.includes("request")) {
                migrationData.push({key: data, value: localStorage.getItem(data)!});
            }
            localStorage.removeItem(data);
        }

        localStorage.setItem("old_data", JSON.stringify(migrationData));

        auth(migrationData).then((clientKey) => {
            localStorage.setItem("clientKey", clientKey);
            getClientProfile(clientKey).then();
            setReady(true);
        });
    }

    const getClientProfile = async (clientKey: string) => {
        const profile = await getProfile(clientKey);
        sessionStorage.setItem("profile", JSON.stringify(profile));
    }

    useEffect(() => {

        const clientKey = localStorage.getItem("clientKey");

        if (!clientKey) {
            storeClientKey();
            return;
        }

        getClientProfile(clientKey).then();
        setReady(true);

    }, []);

    if (!ready) {
        return <LoadingScreen/>;
    }

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={"[Your recaptcha key]"}
            useEnterprise={true}
        >
            <BrowserRouter>
                <Helmet
                    titleTemplate="%s - UAEU Space"
                    defaultTitle="UAEU Space"
                >
                    <meta name="description"
                          content="UAEU Space is a multi-purpose platform for UAEU students to prepare them during their studies. You can find and share materials for courses that are taken by the university's students."/>
                </Helmet>
                <React.Suspense fallback={<LoadingScreen/>}>
                    <NavBar/>
                    <Routes>
                        <Route path={"/"} element={<Home/>}/>
                        <Route path={"/course"} element={<Course/>}/>
                        <Route path={"/course/:tag"} element={<Course/>}/>
                        <Route path={"/professor"} element={<Professor/>}/>
                        <Route path={"/professor/:email"} element={<Professor/>}/>
                        <Route path={"/*"} element={<NotFound/>}/>
                    </Routes>
                    <Footer/>
                </React.Suspense>
            </BrowserRouter>
        </GoogleReCaptchaProvider>
    );
}

export default App;
