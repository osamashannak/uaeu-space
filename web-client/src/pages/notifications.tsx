import styles from '../styles/pages/notifications.module.scss';
import {Helmet} from "@dr.pogodin/react-helmet";

export default function Notifications() {

    return (
        <>
            <Helmet>
                <title>Notifications - SpaceRead</title>
            </Helmet>
            <div className={styles.notifPage}>

                <div className={styles.head}>
                    <h2>Notifications</h2>
                </div>

                <div className={styles.noNotifs}>
                    <span>You have no notifications.</span>
                </div>
            </div>
        </>
    )
}