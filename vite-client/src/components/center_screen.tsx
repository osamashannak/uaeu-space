import {ReactNode, useEffect} from "react";
import styles from "../styles/components/center_screen.module.scss";

export default function CenterScreen({children, setDisplayScreen}: {
    children: ReactNode | ReactNode[],
    setDisplayScreen: (value: "login" | "register" | undefined) => void
}) {

    useEffect(() => {
        const screen = document.querySelector(`.${styles.screen}`) as HTMLDivElement;
        screen.style.display = "flex";

        const body = document.querySelector("body") as HTMLBodyElement;
        body.style.maxHeight = "100vh";
        body.style.overflow = "hidden";

        const html = document.querySelector("html") as HTMLHtmlElement;
        html.style.overscrollBehaviorY = "none";

        return () => {
            body.style.removeProperty("max-height");
            body.style.removeProperty("overflow");
            const html = document.querySelector("html") as HTMLHtmlElement;
            html.style.overscrollBehaviorY = "auto";
        }

    }, []);


    return (
        <div className={styles.screen}>
            <div className={styles.panel} onClick={e => e.stopPropagation()}>
                <div className={styles.deleteButton}
                     onClick={() => {
                         setDisplayScreen(undefined);
                     }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 256 256">
                        <path fill="currentColor"
                              d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/>
                    </svg>
                </div>
                {children}
            </div>
        </div>
    );
}

