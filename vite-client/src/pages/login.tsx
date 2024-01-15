import styles from "../styles/pages/login.module.scss";
import Layout from "../layouts/layout.tsx";
import dayjs from "dayjs";
import {CredentialResponse, GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import {Helmet} from "react-helmet-async";
import {useState} from "react";
import LoginWithEmail from "../components/login/LoginWithEmail.tsx";
import RegisterForm from "../components/login/RegisterForm.tsx";


export default function Login() {


    function googleSignInSuccess(response: CredentialResponse) {
        console.log(response);
    }



    return (
        <Layout>

            <Helmet>
                <title>Login</title>
            </Helmet>

            <LoginWithEmail/>
            <RegisterForm/>

            <div className={styles.loginPage}>

                <div className={styles.headSection}>
                    <span className={styles.title}>Choose how you want to continue</span>
                </div>


                <div className={styles.loginForm}>

                    <button className={styles.formButton} onClick={(e) => {
                        e.stopPropagation();
                        const screen = document.querySelector(`.${styles.screen}`) as HTMLDivElement;
                        screen.style.display = "flex";
                        document.body.style.overflow = "hidden";
                        document.body.style.height = "100vh";
                    }}>Login with Email</button>

                    <button className={styles.signUpButton} onClick={(e) => {
                        e.stopPropagation();
                        const screen = document.querySelector(`.${styles.registerScreen}`) as HTMLDivElement;
                        screen.style.display = "flex";
                        document.body.style.overflow = "hidden";
                        document.body.style.height = "100vh";
                    }}>Create Account</button>

                    <div className={styles.orSeparator}>
                        <span>OR</span>
                    </div>

                    <div className={styles.loginWith}>

                        <GoogleOAuthProvider clientId="<your_client_id>">
                            <GoogleLogin
                                type={"standard"}
                                theme={"outline"}
                                size={"large"}
                                text={"continue_with"}
                                shape={"pill"}
                                itp_support={true}
                                ux_mode={"popup"}
                                useOneTap={false}
                                locale={dayjs.locale()}
                                onSuccess={googleSignInSuccess}/>
                        </GoogleOAuthProvider>
                    </div>

                    <p className={styles.terms}>
                        By continuing, you agree to our <a href={"/terms-of-service"}>Terms of Service</a> and <a
                        href={"/privacy"}>Privacy Policy</a>.
                    </p>


                </div>

            </div>
        </Layout>
    )

}