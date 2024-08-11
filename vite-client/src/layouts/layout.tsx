import styles from "../styles/layout.module.scss";
import Header from "../components/header.tsx";
import Footer from "../components/footer.tsx";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {Helmet} from "react-helmet-async";
import {Outlet, ScrollRestoration} from "react-router-dom";

export default function Layout() {

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

            <Header/>

            <ScrollRestoration/>

            <main>
                <div className={styles.main}>
                    <GoogleReCaptchaProvider
                        reCaptchaKey="6Lf8FeElAAAAAJX3DVLxtBSEydXx0ln7KscspOZ8"
                        useEnterprise={true}
                        scriptProps={{
                            async: true
                        }}>
                        <Outlet/>
                    </GoogleReCaptchaProvider>
                </div>
            </main>

            <Footer/>

            <div className={styles.right}/>

        </>
    )
}