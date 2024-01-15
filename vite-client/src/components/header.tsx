import {Link, useNavigate} from "react-router-dom";
import styles from "../styles/components/header.module.scss";
import {useEffect, useRef, useState} from "react";
import logo from "../assets/logo.png";

export default function Header() {
    const navigate = useNavigate();
    const pathname = window.location.pathname;
    const [selected, setSelected] = useState<string>((pathname || "").toString().split('/')[1] || "");
    const scrollRef = useRef<number>(window.scrollY);

    useEffect(() => {
        setSelected((pathname || "").toString().split('/')[1] || "");
    }, [pathname]);

    const scrollDown = () => {
        document.getElementsByClassName(styles.header2)[0].classList.add(styles.navUp);
        document.getElementsByClassName(styles.mobileNav)[0].classList.add(styles.menuBlur);
    }

    const scrollUp = () => {
        document.getElementsByClassName(styles.header2)[0].classList.remove(styles.navUp);
        document.getElementsByClassName(styles.mobileNav)[0].classList.remove(styles.menuBlur);
    }

    if (typeof window !== "undefined") {
        let scrollCounter = 0;
        const updateInterval = 10; // Set N to your desired value

        window.onscroll = () => {

            if (window.innerWidth > 768) return;

            if (window.scrollY > scrollRef.current && window.scrollY > 100) {
                scrollDown();
                scrollRef.current = window.scrollY;
                return;
            } else if (window.scrollY < 100) {
                scrollUp();
                scrollRef.current = window.scrollY;
                return;
            }

            scrollCounter++;

            if (scrollCounter % updateInterval === 0) {
                const scrollDifference = Math.abs(window.scrollY - scrollRef.current);
                console.log(scrollDifference)

                if (window.scrollY < scrollRef.current && scrollDifference > 300) {
                    scrollUp();
                }

                scrollRef.current = window.scrollY;

                scrollCounter = 0;
            }
        };
    }

    return (
        <>
            <header>
                <div className={styles.header}>
                    <div className={styles.header2}>
                        <h1 className={styles.title} onClick={() => navigate("/")}>
                            <img src={logo} width={"25"} height={"25"} alt={""}/>
                            <span className={styles.titleText}>SpaceRead</span>
                        </h1>

                        <div className={styles.navigation}>

                            <Link className={styles.navLink} to={"/"} title={"Home"}>
                                {selected === "" ?
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                                        <path fill="currentColor" fillRule="evenodd"
                                              d="M12.707 2.293a1 1 0 0 0-1.414 0l-7 7l-2 2a1 1 0 1 0 1.414 1.414L4 12.414V19a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-9-9Z"
                                              clipRule="evenodd"/>
                                    </svg> :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                              d="M19.75 10a.75.75 0 0 0-1.5 0h1.5Zm-14 0a.75.75 0 0 0-1.5 0h1.5Zm14.72 2.53a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM12 3l.53-.53a.75.75 0 0 0-1.06 0L12 3Zm-9.53 8.47a.75.75 0 1 0 1.06 1.06l-1.06-1.06ZM7 21.75h10v-1.5H7v1.5ZM19.75 19v-9h-1.5v9h1.5Zm-14 0v-9h-1.5v9h1.5Zm15.78-7.53l-9-9l-1.06 1.06l9 9l1.06-1.06Zm-10.06-9l-9 9l1.06 1.06l9-9l-1.06-1.06ZM17 21.75A2.75 2.75 0 0 0 19.75 19h-1.5c0 .69-.56 1.25-1.25 1.25v1.5Zm-10-1.5c-.69 0-1.25-.56-1.25-1.25h-1.5A2.75 2.75 0 0 0 7 21.75v-1.5Z"/>
                                    </svg>
                                }
                                <span className={"nav-link-text"}>Home</span>
                            </Link>

                            <Link className={styles.navLink} to={"/course"} title={"Course Materials"}>
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
                                <span className={"nav-link-text"}>Course Materials</span>
                            </Link>

                            <Link className={styles.navLink} to={"/professor"} title={"Rate Professor"}>
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
                                <span className={"nav-link-text"}>Rate Professor</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className={styles.mobileNav}>
                <Link className={"nav-link"} to={"/"}>
                    {selected === "" ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                            <path fill="currentColor" fillRule="evenodd"
                                  d="M12.707 2.293a1 1 0 0 0-1.414 0l-7 7l-2 2a1 1 0 1 0 1.414 1.414L4 12.414V19a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-9-9Z"
                                  clipRule="evenodd"/>
                        </svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M19.75 10a.75.75 0 0 0-1.5 0h1.5Zm-14 0a.75.75 0 0 0-1.5 0h1.5Zm14.72 2.53a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM12 3l.53-.53a.75.75 0 0 0-1.06 0L12 3Zm-9.53 8.47a.75.75 0 1 0 1.06 1.06l-1.06-1.06ZM7 21.75h10v-1.5H7v1.5ZM19.75 19v-9h-1.5v9h1.5Zm-14 0v-9h-1.5v9h1.5Zm15.78-7.53l-9-9l-1.06 1.06l9 9l1.06-1.06Zm-10.06-9l-9 9l1.06 1.06l9-9l-1.06-1.06ZM17 21.75A2.75 2.75 0 0 0 19.75 19h-1.5c0 .69-.56 1.25-1.25 1.25v1.5Zm-10-1.5c-.69 0-1.25-.56-1.25-1.25h-1.5A2.75 2.75 0 0 0 7 21.75v-1.5Z"/>
                        </svg>
                    }
                </Link>

                <Link className={"nav-link uaeu-space-icon"} to={"/course"}>

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
                </Link>

                <Link className={"nav-link uaeu-space-icon"} to={"/professor"}>

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

                </Link>
            </div>
        </>
    );

}