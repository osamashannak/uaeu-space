import styles from '../styles/pages/notifications.module.scss';

export default function Notifications() {

    return (
        <div className={styles.notifPage}>

            <div className={styles.head}>
                <h2>Notifications</h2>
            </div>

            <div className={styles.noNotifs}>
                <span>You have no notifications.</span>
            </div>
        </div>
    )
}