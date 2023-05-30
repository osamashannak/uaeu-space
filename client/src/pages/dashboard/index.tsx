import { parseBody } from "next/dist/server/api-utils/node";
import {useEffect, useState} from "react";
import Head from "next/head";
import styles from "@/styles/Dashboard.module.scss";
import PendingReviews from "@/components/Dashboard/PendingReviews";
import PendingFiles from "@/components/Dashboard/PendingFiles";
import {authDashboard, verifyToken} from "@/api/dashboard";
import {AuthResponse} from "@/interface/dashboard";
import {GetServerSidePropsContext} from "next";
import SearchBox from "@/components/Dashboard/SearchBox";


const Dashboard = (props: AuthResponse) => {

    const [professor, setProfessor] = useState<string | null>(null);
    const [course, setCourse] = useState<string | null>(null);

    useEffect(() => {
        sessionStorage.setItem("token", props.token);
    }, [props.token]);

    if (!props.token) return;

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

                <div className={styles.dashboardBody}>
                    <section className={styles.section}>
                        <h2>Pending Professor Reviews</h2>
                        <div>
                            <span>Search for professor: &nbsp;</span>
                            <SearchBox type={"professor"} setState={setProfessor}/>
                            <div className={styles.resetButton} onClick={() => setProfessor(null)}>Reset</div>
                        </div>
                        <div className={styles.sectionBody}>
                            <PendingReviews professor={professor}/>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2>Pending Course Files</h2>
                        <div>
                            <span>Search for course: &nbsp;</span>
                            <SearchBox type={"course"} setState={setCourse}/>
                            <div className={styles.resetButton} onClick={() => setCourse(null)}>Reset</div>
                        </div>
                        <div className={styles.sectionBody}>
                            <PendingFiles course={course}/>
                        </div>
                    </section>
                </div>

            </div>


        </>
    )


}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    const body = await parseBody(context.req, "1mb");

    const cookiesToken = context.req.cookies["token"];

    if (cookiesToken) {
        const data = await verifyToken(cookiesToken);

        if (data) {
            return {
                props: {
                    ...data,
                    token: cookiesToken
                }
            }
        }

    }  else if (context.req.method === "POST" && body.credential) {
        const data = await authDashboard(body.credential);

        if (data) {
            context.res.setHeader("Set-Cookie", `token=${data.token}; path=/dashboard; HttpOnly; SameSite=Strict; Max-Age=86400`);

            return {
                props: data
            }
        }

    }

    return {
        redirect: {
            permanent: false,
            destination: "/dashboard/auth",
        }
    }
}


export default Dashboard;