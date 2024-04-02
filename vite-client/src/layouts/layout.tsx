import {ReactNode, useEffect} from "react";
import styles from "../styles/layout.module.scss";
import Header from "../components/header.tsx";
import Footer from "../components/footer.tsx";
import ScrollToTop from "../components/scrolltotop.tsx";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {useDispatch, useSelector} from "react-redux";

export default function Layout({children}: { children: ReactNode }) {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    useEffect(() => {

        if (user.status !== null) return;




    }, [user.status]);

    return (
        <>
            <Header/>

            <ScrollToTop/>
            <main>
                <div className={styles.main}>
                    <GoogleReCaptchaProvider
                        reCaptchaKey="6Lf8FeElAAAAAJX3DVLxtBSEydXx0ln7KscspOZ8"
                        useEnterprise={true}
                        scriptProps={{
                            async: true
                        }}>
                    {children}
                    </GoogleReCaptchaProvider>
                </div>
            </main>

            <Footer/>

            <div className={styles.right}/>

        </>
    )
}