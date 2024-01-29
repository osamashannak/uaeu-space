import styles from "../../styles/pages/login.module.scss";
import {isEmailValid, isPasswordValid} from "../../utils.tsx";
import {FormEvent} from "react";


export default function RegisterForm() {

    function formSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(123213213)
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
                        <input type={"text"} onBlur={(e) => {
                            const email = e.target.value;
                            if (!email) return;

                            const emailValid = isEmailValid(email);
                            !emailValid ? e.target.classList.add(styles.invalid) : e.target.classList.remove(styles.invalid);
                        }} required placeholder={"Email"} className={styles.formField}/>
                        <input type={"text"} required placeholder={"Username"} className={styles.formField}/>
                        <input type={"password"} onBlur={(e) => {
                            const passwordValidationElement = document.querySelector("#signup-form") as HTMLDivElement;

                            const password = e.target.value;
                            if (!password) {
                                passwordValidationElement.innerHTML = "";
                                return;
                            }
                            const passwordValidation = isPasswordValid(password);
                            if (typeof passwordValidation === "string") {
                                passwordValidationElement.innerHTML = passwordValidation;
                                e.target.classList.add(styles.invalid);
                            } else {
                                passwordValidationElement.innerHTML = "";
                                e.target.classList.remove(styles.invalid);
                            }
                        }} required placeholder={"Password"} className={styles.formField}/>
                        <div id={"signup-form"} className={styles.validation}></div>
                    </div>

                    <div>
                        <button type={"submit"} className={styles.formButton}>Sign Up</button>
                    </div>
                </form>

            </div>
        </div>
    )

}