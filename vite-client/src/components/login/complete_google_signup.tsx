import styles from "../../styles/pages/login.module.scss";
import {GoogleSignUpProps} from "../../typed/user.ts";
import {FormEvent} from "react";


export default function CompleteGoogleSignUp({autocomplete}: { autocomplete: GoogleSignUpProps }) {


    function formSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("form submitted")
    }


    return (
        <div className={styles.completeSignUpScreen}>
            <div className={styles.panel} onClick={e => e.stopPropagation()}>

                <div className={styles.panelTitle}>
                    <h2>Complete Sign Up</h2>
                    <p>Sign up with Google</p>
                </div>


                <form onSubmit={formSubmit}>
                    <div className={styles.loginForm}>
                        <span>Email</span>
                        <input type={"email"} value={autocomplete.email} disabled required placeholder={"Email"}
                               className={styles.formField}/>
                        <span>Username (can't be changed)</span>
                        <input type={"text"} defaultValue={autocomplete.username} required
                               className={styles.formField}/>

                    </div>

                    <div>
                        <button type={"submit"} className={styles.formButton}>Sign Up</button>
                    </div>
                </form>

            </div>
        </div>
    )
}