"use client";

import styles from "@/styles/Login.module.scss";
import {useState, useEffect} from "react";

const Login = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <div className={styles.loginPage}>

            {isClient &&  <script src="https://accounts.google.com/gsi/client" async ></script>}

            <h1>Personalize Your Experience</h1>

            <div>
                <p></p>
            </div>

            <div className={styles.loginForm}>
               {/* <input type="text" id="email" name="email" placeholder="Email" className={styles.formField}/>
                <input type="password" id="password" name="password" placeholder="Password" className={styles.formField}/>
*/}
                <button className={styles.formButton}>Login</button>
                <button className={styles.signUpButton}>Create Account</button>
            </div>

            <div>
                <p>OR</p>
            </div>


            <div id="g_id_onload"
                 data-client_id="xccx"
                 data-context="signin"
                 data-ux_mode="popup"
                 data-login_uri="cxc"
                 data-auto_prompt="false"
            ></div>

            <div className={styles.loginWith}>
                <div className="g_id_signin"
                     data-type="standard"
                     data-shape="rectangular"
                     data-theme="outline"
                     data-text="signin_with"
                     data-size="large"
                     data-logo_alignment="center"
                     data-width="368"></div>
            </div>

        </div>
    )
}

export default Login;