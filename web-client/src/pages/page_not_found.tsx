import {useEffect} from "react";
import styles from "../styles/pages/error.module.scss";
import brokenMagnifier from "../assets/images/error/broken-magnifier.png";

export default function PageNotFound() {

    useEffect(() => {
        // @ts-expect-error Clarity is not defined
        clarity("set", "ErrorViewed", "true");
    }, []);

    return (
        <div className={styles.errorPage}>
            <div className={styles.textBlock}>
                <span className={styles.errorText}>Page not found!</span>
                <p className={styles.errorSubText}>We couldn't find the page you were looking for.</p>
            </div>
            <img className={styles.image} src={brokenMagnifier} alt="Broken Magnifier"/>
        </div>
    )
}