import styles from "../styles/components/footer.module.scss";
import {Link} from "react-router-dom";


export default function Footer() {
    return (
        <footer>
            <section className={styles.footerBlock}>
                <h2 className={styles.blockTitle}>Join the UAEU Community</h2>
                <Link to={"/login"} className={styles.loginButton}>Go to Login</Link>
            </section>
            <section className={styles.footerBlock}>
                <h2 className={styles.blockTitle}>About UAEU Space</h2>
                <div className={styles.blockBody}>
                    <ul className={styles.blockList}>
                        <li><span>UAEU Space is a multi-purpose platform for UAEU students to prepare them during their studies.</span>
                        </li>
                        <li>
                            <span>Course and professor data is collected from the University&apos;s official website.</span>
                        </li>
                        <li><span>Source code for this website is available on <a target="_blank"
                                                                                  rel="noreferrer"
                                                                                  href="https://github.com/Am4nso/uaeu-space">GitHub</a>.</span>
                        </li>
                    </ul>
                </div>
            </section>
            <section className={styles.footerEnd}>
                <p className={styles.copyright}>© 2023 SpaceRead. Not affiliated with United Arab Emirates
                    University (Student-operated). Emojis by <a href={"https://github.com/twitter/twemoji"}>Twemoji</a>.</p>
                <ul className={styles.links}>
                    <li><Link to={"/terms-of-service"}>Terms of Service</Link></li>
                    <li><Link to={"/privacy"}>Privacy Policy</Link></li>
                    <li><a href={"https://api.uaeu.space/sitemap.xml"}>Site Map</a></li>
                </ul>
            </section>
        </footer>
    );
}