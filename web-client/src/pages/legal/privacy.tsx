import styles from "../../styles/pages/legal.module.scss";
import {Helmet} from "@dr.pogodin/react-helmet";

export default function Privacy() {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - SpaceRead</title>
            </Helmet>
            <div className={styles.page}>
                <section>
                    <h1>Privacy Policy</h1>
                </section>

                <section className={styles.body}>
                    <p>Last Updated: 5th of May, 2024</p>

                    <p>
                        SpaceRead (formerly UAEU Space) (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a platform designed to facilitate
                        the sharing of course
                        materials and professor ratings among students at UAEU. We are committed to protecting the privacy
                        of our users and ensuring the confidentiality and security of their personal information.
                    </p>

                    <h3>Information We Collect</h3>

                    <p>
                        We collect personal and non-personal information to provide and improve our services:
                    </p>

                    <ul>
                        <li>Personal Information: We collect device information, including IP addresses, for security
                            purposes, spam prevention, and website analytics.
                        </li>
                        <li>We may collect non-personal information, such as aggregated data or statistical information,
                            which does not directly identify individuals.
                        </li>
                    </ul>

                    <h3>How Information is Collected</h3>

                    <p>We collect information through the following means:</p>
                    <ul>
                        <li>Direct Collection: We collect device information, including IP addresses, automatically when you
                            access SpaceRead.
                        </li>
                        <li>Third-Party Services: We use Google Analytics and Microsoft Clarity to gather website usage
                            statistics. These services may collect additional non-personal information according to their
                            respective privacy policies.
                        </li>
                    </ul>

                    <h3>Use of Personal Information</h3>
                    <p>We use personal information for the following purposes:</p>

                    <ul>
                        <li>
                            Security and Spam Prevention: Personal information, such as device information and IP addresses, is
                            used to maintain a safe and secure environment on SpaceRead, protect against spam, prevent
                            malicious activities, and identify and address security vulnerabilities.
                        </li>
                        <li>
                            Website Improvement: We may use non-personal information, such as aggregated data and analytics, to
                            analyze website usage patterns, understand user preferences, and enhance the overall user
                            experience.
                        </li>
                    </ul>

                    <h3>Sharing of Personal Information</h3>

                    <p>
                        We prioritize the protection of your personal information and limit its sharing to the following
                        cases:
                    </p>

                    <ul>
                        <li>
                            Third-Party Service Providers: We may engage trusted third-party service providers to assist in
                            the operation and maintenance of SpaceRead. These providers have access to personal information
                            only to the extent necessary to perform their services and are obligated to keep it
                            confidential.
                        </li>
                        <li>
                            Legal Requirements: We may disclose personal information if required to do so by law or in
                            response to valid legal requests, such as subpoenas, court orders, or government regulations. We
                            will make reasonable efforts to notify affected individuals unless prohibited by law or court
                            order.
                        </li>
                    </ul>

                    <h3>Data Retention</h3>
                    <p>
                        We retain personal information, such as device information, indefinitely for security and spam
                        prevention purposes.
                    </p>

                    <h3>Data Security</h3>
                    <p>
                        We take reasonable measures to protect personal information from loss, theft, misuse, and
                        unauthorized access, disclosure, alteration, and destruction. However, no method of transmission
                        over the Internet or electronic storage is completely secure, and we cannot guarantee absolute
                        security.
                    </p>

                    <h3>Children&apos;s Privacy</h3>
                    <p>
                        SpaceRead does not target or knowingly collect personal information from individuals under the age
                        of 17. If we become aware that personal information of a minor has been inadvertently collected, we
                        will take steps to delete it as soon as possible.
                    </p>

                    <p>
                        If you have any questions or concerns regarding this privacy policy or SpaceRead&apos;s privacy
                        practices, please contact us at <a href={"mailto:uaeuspace@gmail.com"}>uaeuspace@gmail.com</a>.
                    </p>


                </section>
            </div>
        </>
    )
}