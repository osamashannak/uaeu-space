import Script from "next/script";
import Header from "@/components/Global/Header";
import Footer from "@/components/Global/Footer";
import '@/styles/globals.scss'
import {Montserrat} from "next/font/google";

const montserrat = Montserrat({subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800"]});

export const metadata = {
    metadataBase: new URL("https://uaeu.space"),
    title: "UAEU Space",
    description: "UAEU Space is a multi-purpose platform for UAEU students to prepare them during their studies. You can find and share materials for courses that are taken by the university's students."
}


export default function RootLayout({children,}: { children: React.ReactNode }) {

    return (
        <html lang="en" className={montserrat.className}>
        <body>

        <div className={"body"}>
            <Header/>
            <main>
                <div className={"main"}>
                    {children}
                </div>
            </main>
            <Footer/>

            <div className={"right"}/>
        </div>


        </body>


        <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-GF863H0ZSZ"
            strategy="afterInteractive"/>

        <Script id="google-analytics" strategy="afterInteractive">{`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-GF863H0ZSZ');`}
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

        </html>
    )
}
