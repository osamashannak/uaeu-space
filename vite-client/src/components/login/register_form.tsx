import styles from "../../styles/pages/login.module.scss";
import {isEmailValid, isPasswordValid, isUsernameValid} from "../../utils.tsx";
import {FormEvent, useEffect, useState} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";


export default function RegisterForm() {

    const [form, setForm] = useState({
        email: "",
        username: "",
        password: ""
    });
    const {executeRecaptcha} = useGoogleReCaptcha();


    useEffect(() => {
        const usernameValid = isUsernameValid(form.username);

        if (form.username.length > 0 && typeof usernameValid === "string") {
            setValidationMessage(usernameValid);
            return;
        }

        const passwordValid = isPasswordValid(form.password);

        if (form.password.length > 0 && typeof passwordValid === "string") {
            setValidationMessage(passwordValid);
            return;
        }

        setValidationMessage("");
        
    }, [form.password, form.username]);

    async function formSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        /*if (!executeRecaptcha) {
            setValidationMessage("Authentication servers are currently down. Please try again later.");
            return;
        }

        const token = await executeRecaptcha("new_account");*/


    }

    function setValidationMessage(message: string) {
        const validation = document.querySelector(`#signup-form`) as HTMLDivElement;
        validation.innerText = message;
    }

    function canSubmit() {
        return isEmailValid(form.email) && isUsernameValid(form.username) === true && isPasswordValid(form.password) === true;
    }

    return (
        <div className={styles.registerScreen}>
            <div className={styles.panel} onClick={e => e.stopPropagation()}>
                <div className={styles.deleteButton}
                     onClick={() => {
                         const screen = document.querySelector(`.${styles.registerScreen}`) as HTMLDivElement;
                         screen.style.display = "none";
                         document.body.style.removeProperty("max-height");
                         document.body.style.removeProperty("overflow");
                         const html = document.querySelector("html") as HTMLHtmlElement;
                         html.style.overscrollBehaviorY = "auto";

                     }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 256 256">
                        <path fill="currentColor"
                              d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/>
                    </svg>
                </div>

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
                               }} required
                               placeholder={"Email"}
                               className={styles.formField}/>

                        <input type={"text"}
                               onChange={(e) => {
                                   const username = e.target.value;
                                   setForm({...form, username});
                               }}
                               onBlur={(e) => {
                                   const username = e.target.value;
                                   if (!username) return;

                                   const usernameValid = isUsernameValid(username);

                                   if (typeof usernameValid === "string") {
                                       e.target.classList.add(styles.invalid);
                                   } else {
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
                                       e.target.classList.add(styles.invalid);
                                   } else {
                                       e.target.classList.remove(styles.invalid);
                                   }

                               }}
                               required placeholder={"Password"}
                               className={styles.formField}/>
                        <div id={"signup-form"} className={styles.validation}></div>
                    </div>

                    <div>
                        <button type={"submit"} className={canSubmit() ? styles.formButton : styles.disabledButton}>Sign
                            Up
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )

}