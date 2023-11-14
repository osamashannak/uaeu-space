import Head from "next/head";
import styles from "@/styles/Dashboard.module.scss";
import {authDashboard, verifyToken} from "@/api/dashboard";
import {cookies} from "next/headers";
import {redirect, useRouter} from "next/navigation";
import DashboardBody from "@/app/dashboard/DashboardBody";


const Dashboard = async () => {
    const router = useRouter();

    const cookiesToken = cookies().get("token");

    if (cookiesToken) {
        const data = await verifyToken(cookiesToken.value);

        if (data) {
            return {
                props: {
                    ...data,
                    token: cookiesToken
                }
            }
        }

    } else if (context.req.method !== "POST" || !body.credential) {
        return redirect("/dashboard/auth");

    }

    const data = await authDashboard(body.credential);

    if (!data || !data.token) {
        return redirect("/dashboard/auth");
    }

    cookies().set("token", data.token, {
        path: "/dashboard",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 86400
    });

    return (
        <>
            <Head>
                <title>Dashboard - UAEU Space</title>
                <meta name="robots" content="noindex"/>
            </Head>

            <div className={styles.dashboard}>
                <section className={styles.header}>
                    <h1>Dashboard</h1>
                </section>

                <section>
                    <h2>Statistics</h2>
                    {/*Google Analytics goes here*/}
                </section>

                <DashboardBody/>

            </div>

        </>
    )


}


export default Dashboard;