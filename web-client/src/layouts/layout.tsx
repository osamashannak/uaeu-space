import styles from "../styles/layout.module.scss";
import Header from "../components/header.tsx";
import Footer from "../components/footer.tsx";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {Outlet, ScrollRestoration} from "react-router-dom";
import MobileNavigation from "../components/mobile_navigation.tsx";
import {useEffect, useState} from "react";
import {Helmet} from "@dr.pogodin/react-helmet";

export default function Layout() {

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (
        <>
            <Helmet>
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-8S359E0E82"></script>
                <script>
                    {`
                       window.dataLayer = window.dataLayer || [];
                       function gtag(){dataLayer.push(arguments);}
                       gtag('js', new Date());
                       gtag('config', 'G-8S359E0E82');
                    `}
                </script>
                <script type="text/javascript">
                    {`
                          (function (c, l, a, r, i, t, y){
                          c[a] = c[a] || function () {
                          (c[a].q = c[a].q || []).push(arguments)
                          };
                          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                          })
                          (window, document, "clarity", "script", "kxqletktmo"
                          );
                    `}
                </script>
            </Helmet>

            {width > 768 ? <Header/> : <MobileNavigation/>}

            <ScrollRestoration/>

            <main>
                <GoogleReCaptchaProvider
                    reCaptchaKey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY}
                    useEnterprise={true}
                    scriptProps={{
                        async: true
                    }}>
                    <Outlet/>
                </GoogleReCaptchaProvider>
            </main>

            <Footer/>

            <div className={styles.right}/>

        </>
    )
}