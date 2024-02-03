import styles from "../styles/pages/login.module.scss";
import Layout from "../layouts/layout.tsx";
import dayjs from "dayjs";
import {CredentialResponse, GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import {Helmet} from "react-helmet-async";
import {useState} from "react";
import LoginWithEmail from "../components/login/login_with_email.tsx";
import RegisterForm from "../components/login/register_form.tsx";
import CompleteGoogleSignUp from "../components/login/complete_google_signup.tsx";
import {GoogleSignUpProps} from "../typed/user.ts";
import {sendGoogleLogin} from "../api/auth.ts";


export default function Login() {

    const [googleSignUp, setGoogleSignUp] = useState<GoogleSignUpProps | null>(null);


    function googleSignInSuccess(response: CredentialResponse) {
        if (!response.credential) {
            return;
        }

       // todo check if user is already signed up before
        sendGoogleLogin(response.credential).then(async (res) => {
            if (!res) return;

            const data = await res.json();

            if ('redirect' in data) {
                window.location.href = data.redirect;
                return;
            }

            setGoogleSignUp({
                email: data.email,
                username: data.suggestedUsername,
                googleId: data.gid
            });

        });


    }

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

    if (!googleClientId) {
        console.error("Google Client ID not found in .env file");
    }

    function getWidth() {
        console.log(innerWidth)
        if (window.innerWidth <= 415) {
            return window.innerWidth-46;
        } else if (window.innerWidth <= 768) {
            return 370;
        }
        return 400;
    }


    return (
        <Layout>

            <Helmet>
                <title>Login</title>
            </Helmet>

            <LoginWithEmail/>
            <RegisterForm/>
            {googleSignUp && <CompleteGoogleSignUp autocomplete={googleSignUp}/>}


            <div className={styles.loginPage}>

                <div className={styles.headSection}>
                    <span className={styles.title}>Choose how you want to continue</span>
                </div>


                <div className={styles.loginForm}>

                    <button className={styles.formButton} onClick={(e) => {
                        e.stopPropagation();
                        const screen = document.querySelector(`.${styles.screen}`) as HTMLDivElement;
                        screen.style.display = "flex";
                        document.body.style.maxHeight = "100vh";
                        document.body.style.overflow = "hidden";
                        const html = document.querySelector("html") as HTMLHtmlElement;
                        html.style.overscrollBehaviorY = "none";
                    }}>Login with Email
                    </button>

                    <button className={styles.signUpButton} onClick={(e) => {
                        e.stopPropagation();
                        const screen = document.querySelector(`.${styles.registerScreen}`) as HTMLDivElement;
                        screen.style.display = "flex";
                        document.body.style.maxHeight = "100vh";
                        document.body.style.overflow = "hidden";
                        const html = document.querySelector("html") as HTMLHtmlElement;
                        html.style.overscrollBehaviorY = "none";
                    }}>Create Account
                    </button>

                    <div className={styles.orSeparator}>
                        <span>OR</span>
                    </div>

                    <div className={styles.loginWith}>

                        <GoogleOAuthProvider clientId={googleClientId}>
                            <GoogleLogin
                                width={getWidth()}
                                type={"standard"}
                                theme={"outline"}
                                size={"large"}
                                text={"continue_with"}
                                shape={"pill"}
                                ux_mode={"popup"}
                                useOneTap={false}
                                locale={dayjs.locale()}
                                use_fedcm_for_prompt
                                itp_support
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