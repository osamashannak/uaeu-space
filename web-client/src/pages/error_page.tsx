import {useRouteError} from "react-router-dom";
import styles from "../styles/pages/error.module.scss";
import * as Sentry from "@sentry/react";

export function ErrorPage() {

    const error = useRouteError();

    if (error) {
        Sentry.captureException(error);
    }

    return (
        <div className={styles.errorPage}>
            <div className={styles.textBlock}>
                <span className={styles.errorText}>Oops! Something went wrong 😅</span>
                <p className={styles.errorSubText}>Try refreshing the page or come back later.</p>
            </div>
        </div>
    );
}
