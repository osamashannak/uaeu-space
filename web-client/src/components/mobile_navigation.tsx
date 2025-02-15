import styles from "../styles/components/global/mobile_navigation.module.scss";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";


export default function MobileNavigation() {

    const scrollRef = useRef<number>(window.scrollY);
    const navigate = useNavigate();
    const [scrolling, setScrolling] = useState(false);
    const [selected, setSelected] = useState<string>((window.location.pathname || "").toString().split('/')[1] || "");

    useEffect(() => {
        setSelected((window.location.pathname || "").toString().split('/')[1] || "");
    }, [window.location.pathname]);

    const headerClass = scrolling ? styles.navUp : '';
    const menuBlur = scrolling ? styles.menuBlur : '';

    useEffect(() => {
        let scrollCounter = 0;
        const updateInterval = 6;

        window.onscroll = () => {
            if (window.innerWidth > 768) return;

            if (window.scrollY > scrollRef.current && window.scrollY > 100) {
                setScrolling(true);
                scrollRef.current = window.scrollY;
                return;
            } else if (window.scrollY < 100) {
                setScrolling(false);
                scrollRef.current = window.scrollY;
                return;
            }

            scrollCounter++;

            if (scrollCounter % updateInterval === 0) {
                const scrollDifference = Math.abs(window.scrollY - scrollRef.current);

                if (window.scrollY < scrollRef.current && scrollDifference > 50) {
                    setScrolling(false);
                }

                scrollRef.current = window.scrollY;

                scrollCounter = 0;
            }
        };

        return () => {
            window.onscroll = null;
        }
    }, []);

    return (
        <>
            <header>
                <div className={styles.header}>
                    <div className={`${styles.header2} ${headerClass}`}>
                        <h1 className={styles.title} onClick={() => navigate("/")}>
                            <svg width="25" height="25" viewBox="0 0 192 192" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <circle cx="96" cy="96" r="96" fill="#0599E5"/>
                                <path
                                    d="M89.1191 141.493C79.9991 136.213 52.1591 119.701 50.7191 117.973C49.3751 116.533 48.6071 114.613 48.6071 109.813C48.6071 106.447 48.6071 105.013 48.6071 102.613C48.9911 102.613 55.5191 105.493 62.7191 108.373C69.3541 111.027 81.4391 116.053 81.4391 116.053C81.4391 116.053 72.3191 111.658 54.0791 100.213C29.5991 84.8526 25.2791 83.3816 29.5991 81.0126C44.4791 72.8526 42.5591 74.6271 60.3191 65.6526C91.9991 49.6442 93.7271 48.2766 95.8391 48.8526C95.8391 48.8526 95.8391 48.8526 162.559 81.4926C164.383 82.385 164.453 83.9054 163.519 84.3726C160.639 85.8126 163.519 84.3726 135.199 100.693C107.381 116.724 107.839 117.493 107.839 117.493C107.839 117.493 107.839 117.493 124.428 110.101C142.111 102.613 142.111 102.613 142.111 102.613C142.111 102.613 142.111 104.533 142.111 109.813C142.111 118.098 139.039 119.413 139.039 119.413C139.039 119.413 111.116 138.96 99.1991 142.933C97.7591 143.413 93.2646 143.893 89.1191 141.493Z"
                                    fill="white"/>
                                <path
                                    d="M146.239 117.973V101.077L153.919 97.8127C153.919 97.8127 153.919 106.069 153.919 116.053C153.919 126.133 153.919 133.333 153.919 134.293L150.079 131.893L146.239 134.293C146.239 134.293 146.239 134.293 146.239 117.973Z"
                                    fill="white"/>
                            </svg>
                            <span className={styles.titleText}>SpaceRead</span>
                        </h1>
                    </div>
                </div>
            </header>
            <div className={`${styles.mobileNav} ${menuBlur}`}>
                <Link className={styles.navLinkMobile} to={"/professor"}>

                    {selected === "professor" ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M6.385 13.615h2.21l5.263-5.269q.129-.148.193-.31q.064-.163.064-.323t-.064-.316q-.064-.157-.188-.305l-.925-.95q-.128-.129-.298-.193q-.169-.064-.334-.064q-.16 0-.32.054q-.16.055-.307.203l-5.294 5.264zM12.3 8.688l-.95-.944l.956-.956l.925.95zm-.485 4.927h5.8v-1h-4.8zM3 20.077V4.615q0-.69.463-1.152Q3.925 3 4.615 3h14.77q.69 0 1.152.463q.463.462.463 1.152v10.77q0 .69-.462 1.153q-.463.462-1.153.462H6.077z"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M6.385 13.615h2.203l5.27-5.269q.129-.148.193-.31q.064-.163.064-.323t-.067-.316q-.067-.157-.19-.305l-.92-.95q-.128-.129-.298-.193q-.169-.064-.334-.064q-.16 0-.322.064q-.163.064-.31.193l-5.29 5.27zm6.846-5.902l-.925-.944zm-5.962 5.018v-.95l3.448-3.448l.462.488l.47.48l-3.43 3.43zm3.91-3.91l.47.48l-.932-.968zm.63 4.794h5.806v-1H12.81zM3 20.077V4.615q0-.69.463-1.152Q3.925 3 4.615 3h14.77q.69 0 1.152.463q.463.462.463 1.152v10.77q0 .69-.462 1.153q-.463.462-1.153.462H6.077zM5.65 16h13.735q.23 0 .423-.192q.192-.193.192-.423V4.615q0-.23-.192-.423Q19.615 4 19.385 4H4.615q-.23 0-.423.192Q4 4.385 4 4.615v13.03zM4 16V4z"/>
                        </svg>
                    }
                    <div className={styles.mobileText}>
                        <span>Rate Professor</span>
                    </div>

                </Link>

                <Link className={styles.navLinkMobile} to={"/course"}>

                    {selected === "course" ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                             viewBox="0 0 256 256">
                            <path fill="currentColor"
                                  d="M216 32v160a8 8 0 0 1-8 8H72a16 16 0 0 0-16 16h136a8 8 0 0 1 0 16H48a8 8 0 0 1-8-8V56a32 32 0 0 1 32-32h136a8 8 0 0 1 8 8Z"/>
                        </svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                             viewBox="0 0 256 256">
                            <path fill="currentColor"
                                  d="M208 26H72a30 30 0 0 0-30 30v168a6 6 0 0 0 6 6h144a6 6 0 0 0 0-12H54v-2a18 18 0 0 1 18-18h136a6 6 0 0 0 6-6V32a6 6 0 0 0-6-6Zm-6 160H72a29.87 29.87 0 0 0-18 6V56a18 18 0 0 1 18-18h130Z"/>
                        </svg>

                    }
                    <div className={styles.mobileText}>
                        <span>Course Materials</span>
                    </div>
                </Link>

                <a className={styles.navLinkMobile} href={"https://instagram.com/uaeu.space"} target={"_blank"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8"/>
                            <path d="M3 16V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m17.5 6.51l.01-.011"/>
                        </g>
                    </svg>
                    <div className={styles.mobileText}>
                        <span>Follow us</span>
                    </div>

                </a>

            </div>

        </>

    )
}