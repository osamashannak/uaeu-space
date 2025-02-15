import styles from "../styles/pages/login.module.scss";
import Layout from "../layouts/layout.tsx";
import dayjs from "dayjs";
import {CredentialResponse, GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import {Helmet} from "react-helmet-async";
import {useEffect, useState} from "react";
import LoginWithEmail from "../components/login/login_with_email.tsx";
import RegisterForm from "../components/login/register_form.tsx";
import CompleteGoogleSignUp from "../components/login/complete_google_signup.tsx";
import {GoogleSignUpProps} from "../typed/user.ts";
import {sendGoogleLogin} from "../api/auth.ts";


export default function Login() {

    const [displayScreen, setDisplayScreen] = useState<"login" | "register" | undefined>();
    const [googleSignUp, setGoogleSignUp] = useState<GoogleSignUpProps | null>(null);
    const [width, setWidth] = useState<number>(getWidth());


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

    useEffect(() => {
        window.onresize = () => {
            setWidth(getWidth());
        }

        return () => {
            window.onresize = null;
        }
    }, []);

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

    function getWidth() {
        if (window.innerWidth <= 332) {
            return 290;
        } else if (window.innerWidth <= 415) {
            return window.innerWidth-46;
        } else if (window.innerWidth <= 768) {
            return 370;
        }
        return 400;
    }


    return (
        <>

            <Helmet>
                <title>Login - SpaceRead</title>
                <meta name={"description"} content={"Login or sign up to SpaceRead."}/>
            </Helmet>

            {
                displayScreen === "register" && <RegisterForm setDisplayScreen={setDisplayScreen}/>
            }

            {
                displayScreen === "login" && <LoginWithEmail setDisplayScreen={setDisplayScreen}/>
            }

            {googleSignUp && <CompleteGoogleSignUp autocomplete={googleSignUp} setDisplayScreen={setDisplayScreen}/>}


            <div className={styles.loginPage}>

                <div className={styles.headSection}>
                    <span className={styles.title}>Choose how you want to continue</span>
                </div>


                <div className={styles.loginForm}>

                    <button className={styles.formButton} onClick={(e) => {
                        e.stopPropagation();
                        setDisplayScreen("login");
                    }}>Login with Email
                    </button>

                    <button className={styles.signUpButton} onClick={(e) => {
                        e.stopPropagation();
                        setDisplayScreen("register");
                    }}>Create Account
                    </button>

                    <div className={styles.orSeparator}>
                        <span>OR</span>
                    </div>

                    <div className={styles.loginWith}>

                        <GoogleOAuthProvider clientId={googleClientId}>
                            <GoogleLogin
                                width={width}
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
        </>
    )

}