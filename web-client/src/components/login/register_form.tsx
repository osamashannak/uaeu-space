import styles from "../../styles/pages/login.module.scss";
import {isEmailValid, isPasswordValid, isUsernameValid} from "../../utils.tsx";
import {FormEvent, useEffect, useState} from "react";
import {sendSignUpRequest} from "../../api/auth.ts";
import CenterScreen from "../center_screen.tsx";


export default function RegisterForm({setDisplayScreen}: { setDisplayScreen: (screen: "login" | "register" | undefined) => void }) {


    const [form, setForm] = useState({
        email: "",
        username: "",
        password: ""
    });

    //const {executeRecaptcha} = useGoogleReCaptcha();

    const [validationMessage, setValidationMessage] = useState({
        username: "",
        password: "",
        email: ""
    });
    const [failedAttempt, setFailedAttempt] = useState(false);


    useEffect(() => {
        setFailedAttempt(false);
    }, [form]);


    async function formSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        /*if (!executeRecaptcha) {
            setValidationMessage("Authentication servers are currently down. Please try again later.");
            return;
        }

        const token = await executeRecaptcha("new_account");*/


        const validation = document.querySelector(`#signup-form`) as HTMLDivElement;
        validation.innerText = "";

        const button = document.querySelector(`.${styles.formButton}`) as HTMLButtonElement;
        button.disabled = true;
        button.classList.add(styles.disabledButton);

        sendSignUpRequest(form.username, form.email, form.password).then(async (res) => {

            if (!res || res.status !== 200) {
                console.log(res)
                validation.innerText = (await res?.json())?.message ?? "The authentication servers are currently down. Please try again later.";

                button.disabled = false;
                button.classList.remove(styles.disabledButton);
                setFailedAttempt(true);

                return;
            }

            // dispatch


            const responseJson = await res.json();

            window.location.href = responseJson.redirect as string;

        })


    }

    function canSubmit() {
        return !failedAttempt && isEmailValid(form.email) && isUsernameValid(form.username) === true && isPasswordValid(form.password) === true;
    }

    function getValidationMessage() {
        if (validationMessage.username) return validationMessage.username;
        if (validationMessage.password) return validationMessage.password;
        return "";
    }

    return (
        <CenterScreen setDisplayScreen={setDisplayScreen}>

                    <div className={styles.panelTitle}>
                        <h2>Sign Up</h2>
                        <p>Welcome to SpaceRead</p>
                    </div>


                    <form onSubmit={formSubmit}>
                        <div className={styles.loginForm}>
                            <input type={"text"}
                                   onChange={(e) => {
                                       const email = e.target.value;
                                       setForm({...form, email});
                                   }}
                                   onBlur={(e) => {
                                       const email = e.target.value;
                                       if (!email) return;

                                       const emailValid = isEmailValid(email);
                                       !emailValid ? e.target.classList.add(styles.invalid) : e.target.classList.remove(styles.invalid);
                                   }}
                                   required
                                   autoComplete={"email"}
                                   placeholder={"Email"}
                                   className={styles.formField}/>

                            <input type={"text"}
                                   onChange={(e) => {
                                       const username = e.target.value;
                                       setForm({...form, username});
                                   }}
                                   pattern="[\p{L} \-]+"
                                   onBlur={(e) => {
                                       const username = e.target.value;
                                       if (!username) return;

                                       const usernameValid = isUsernameValid(username);

                                       if (typeof usernameValid === "string") {
                                           setValidationMessage({
                                               ...validationMessage,
                                               username: usernameValid
                                           });
                                           e.target.classList.add(styles.invalid);
                                       } else {
                                           setValidationMessage({
                                               ...validationMessage,
                                               username: ""
                                           });
                                           e.target.classList.remove(styles.invalid);
                                       }
                                   }}
                                   required
                                   placeholder={"Username"}
                                   className={styles.formField}/>

                            <input type={"password"}
                                   onChange={(e) => {
                                       const password = e.target.value;
                                       setForm({...form, password});
                                   }}
                                   onBlur={(e) => {
                                       const password = e.target.value;

                                       const passwordValidation = isPasswordValid(password);

                                       if (typeof passwordValidation === "string") {
                                           setValidationMessage({
                                               ...validationMessage,
                                               password: passwordValidation
                                           });
                                           e.target.classList.add(styles.invalid);
                                       } else {
                                           setValidationMessage({
                                               ...validationMessage,
                                               password: ""
                                           });
                                           e.target.classList.remove(styles.invalid);
                                       }

                                   }}
                                   autoComplete={"new-password"}
                                   required
                                   placeholder={"Password"}
                                   className={styles.formField}/>
                            <div id={"signup-form"} className={styles.validation}>
                                <p>{getValidationMessage()}</p>
                            </div>
                        </div>

                        <div>
                            <button type={"submit"}
                                    className={canSubmit() ? styles.formButton : styles.disabledButton}>Sign
                                Up
                            </button>
                        </div>
                    </form>

        </CenterScreen>
    )

}