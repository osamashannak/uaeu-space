import '@/styles/globals.scss'
import type {AppProps} from 'next/app'
import {Montserrat} from "next/font/google";
import {Router} from "next/router";
import NProgress from "nprogress";
import {GoogleReCaptchaProvider} from 'react-google-recaptcha-v3';
import Layout from "@/components/Global/Layout";

const montserrat = Montserrat({subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700"]});

NProgress.configure({showSpinner: false});

Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeError", () => () => NProgress.done());

export default function App({Component, pageProps}: AppProps) {


    return (
        <>
            <style jsx global>{`
              html {
                font-family: ${montserrat.style.fontFamily};
              }
            `}</style>
            <Layout>
                <GoogleReCaptchaProvider
                    reCaptchaKey="6Lf8FeElAAAAAJX3DVLxtBSEydXx0ln7KscspOZ8"
                    useEnterprise={true}
                    scriptProps={{
                        async: true
                }}>
                    <Component {...pageProps} />
                </GoogleReCaptchaProvider>
            </Layout>
        </>

    );

}
