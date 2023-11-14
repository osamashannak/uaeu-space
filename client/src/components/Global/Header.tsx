"use client";

import Image from 'next/image';
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import styles from "@/styles/components/Header.module.scss";

const Header = () => {

    const router = useRouter();
    const pathname = usePathname();
    const [selected, setSelected] = useState<string>((pathname || "").toString().split('/')[1] || "");

    useEffect(() => {
        setSelected((pathname || "").toString().split('/')[1]);
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
        const scrollRef = useRef<number>(window.scrollY);
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
                        <h1 className={styles.title} onClick={() => router.push("/")}>
                            <Image src={"/logo.png"} width={"25"} height={"25"} priority alt={""}/>
                            <span className={styles.titleText}>UAEU Space</span>
                        </h1>

                        <div className={styles.navigation}>

                            <Link className={styles.navLink} href={"/"}>
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

                            <Link className={styles.navLink} href={"/course"}>
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

                            <Link className={styles.navLink} href={"/professor"}>
                                {selected === "professor" ?
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                         viewBox="0 0 512 512">
                                        <path fill="currentColor"
                                              d="M332.64 64.58C313.18 43.57 286 32 256 32c-30.16 0-57.43 11.5-76.8 32.38c-19.58 21.11-29.12 49.8-26.88 80.78C156.76 206.28 203.27 256 256 256s99.16-49.71 103.67-110.82c2.27-30.7-7.33-59.33-27.03-80.6ZM432 480H80a31 31 0 0 1-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75c1.94 10.73-.68 21.34-7.18 29.11A31 31 0 0 1 432 480Z"/>
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                         viewBox="0 0 512 512">
                                        <path fill="none" stroke="currentColor" strokeLinecap="round"
                                              strokeLinejoin="round" strokeWidth="32"
                                              d="M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96Z"/>
                                        <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32"
                                              d="M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304Z"/>
                                    </svg>

                                }
                                <span className={"nav-link-text"}>Rate Professor</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className={styles.mobileNav}>
                <Link className={"nav-link"} href={"/"}>
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

                <Link className={"nav-link uaeu-space-icon"} href={"/course"}>

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

                <Link className={"nav-link uaeu-space-icon"} href={"/professor"}>

                    {selected === "professor" ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512">
                            <path fill="currentColor"
                                  d="M332.64 64.58C313.18 43.57 286 32 256 32c-30.16 0-57.43 11.5-76.8 32.38c-19.58 21.11-29.12 49.8-26.88 80.78C156.76 206.28 203.27 256 256 256s99.16-49.71 103.67-110.82c2.27-30.7-7.33-59.33-27.03-80.6ZM432 480H80a31 31 0 0 1-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75c1.94 10.73-.68 21.34-7.18 29.11A31 31 0 0 1 432 480Z"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="32"
                                  d="M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96Z"/>
                            <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32"
                                  d="M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304Z"/>
                        </svg>
                    }

                </Link>
            </div>
        </>
    );
}

export default Header;