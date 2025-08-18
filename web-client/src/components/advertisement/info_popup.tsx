import reviewStyles from "../../styles/components/professor/review.module.scss";
import {Dispatch, SetStateAction, useEffect, useRef} from "react";
import headerStyles from "../../styles/components/global/header.module.scss";


export default function InfoPopup(props: {
    setShowPopup: Dispatch<SetStateAction<boolean>>,
    setShowAd: Dispatch<SetStateAction<boolean>>,
}) {

    const scrollPosition = useRef(window.scrollY);

    useEffect(() => {
        // @ts-expect-error Clarity not defined
        clarity("set", "AdPopup", "true");

        scrollPosition.current = window.scrollY;

        const html = document.querySelector("html") as HTMLHtmlElement;
        const header = document.querySelector("header") as HTMLElement;
        const mobileNav = document.querySelector(`.${headerStyles.mobileNav}`) as HTMLElement;

        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

        html.style.overflow = "hidden";
        html.style.overscrollBehaviorY = "none";
        html.style.marginRight = `${scrollBarWidth}px`;

        if (window.innerWidth <= 768) {
            header.style.display = "none";
            mobileNav.style.display = "none";
        }

        return () => {
            html.style.removeProperty("overflow");
            html.style.removeProperty("margin-right");
            html.style.removeProperty("overscroll-behavior-y");

            const body = document.querySelector("body") as HTMLBodyElement;
            body.style.removeProperty("position");

            header.style.removeProperty("display");
            mobileNav.style.removeProperty("display");

            window.scrollTo(0, scrollPosition.current);
        }
    }, []);

    return (
        <div className={reviewStyles.popup}>
            <div className={reviewStyles.popInside}>
                <div className={reviewStyles.popupContent}>
                            <span
                                className={reviewStyles.popupText}>Advertisements help us pay for website costs.</span>
                    <div className={reviewStyles.popupButtons}>
                        <button onClick={() => props.setShowAd(false)}>Hide advertisement</button>
                        <button onClick={() => props.setShowPopup(false)}>Ok</button>
                    </div>
                </div>
            </div>
        </div>
    )
}