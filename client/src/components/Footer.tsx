import Link from "next/link";


const Footer = () => {
    return (
        <footer>
            <section className={"footer-info"}>
                <h2>Information about UAEU Space</h2>
                <ul>
                    <li><span>1. UAEU Space is a multi-purpose platform for UAEU students to prepare them during their studies. You can find and share materials for courses that are taken by the university&apos;s students.</span></li>
                    <li><span>2. Course and professor data is collected from the University&apos;s official website.</span></li>
                    <li><span>3. Source code for this website is available on <a target="_blank"
                                                        rel="noreferrer"
                                                        href="https://github.com/Am4nso/uaeu-space">GitHub</a>.</span>
                    </li>

                </ul>
            </section>
            <section className={"footer-end"}>
                <p>Copyright © 2023 UAEU Space. Not affiliated with United Arab Emirates University.</p>
                <ul>
                    <li><Link href={"/terms-of-service"}>Terms of Service</Link></li>
                    <li><Link href={"/privacy"}>Privacy Policy</Link></li>
                    <li><a href={"https://api.uaeu.space/sitemap.xml"}>Site Map</a></li>
                    <li><a rel={"nofollow"} href={"/dashboard"}>Dashboard</a></li>
                </ul>
            </section>
        </footer>
    );
}

export default Footer;