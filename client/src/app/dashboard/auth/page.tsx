"use client";

import Head from "next/head";
import styles from "@/styles/Dashboard.module.scss";
import Script from "next/script";

declare var google: any;

const DashboardAuth = () => {

    const renderButton = () => {

        if(typeof google === "undefined") {
            setTimeout(renderButton, 250);
            return;
        }

        google.accounts.id.initialize({
            client_id: "503811163032-7sb2rm7k4r4knulc0ig7ubp9jcjanaco.apps.googleusercontent.com",
            login_uri: "https://uaeu.space/dashboard",
            ux_mode: "redirect",
        });

        google.accounts.id.renderButton(
            document.getElementById("googleLogin"),
            {
                type: "standard",
                theme: "outline",
                size: "large",
                text: "signin_with",
                locale: "en_US"
            });
    }

    renderButton();

    return (
        <>
            <Head>
                <title>Dashboard - UAEU Space</title>
                <meta name="robots" content="noindex"/>
            </Head>

            <Script src="https://accounts.google.com/gsi/client" async defer/>

            <div className={styles.dashboard}>
                <h1>Dashboard</h1>

                <section className={styles.login}>
                    <h3>Login to access the dashboard</h3>
                    <div id={"googleLogin"} className={styles.googleLogin}/>
                </section>

            </div>
        </>
    )
}

export default DashboardAuth;