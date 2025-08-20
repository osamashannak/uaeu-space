import reviewStyles from "../../styles/components/professor/review.module.scss";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import headerStyles from "../../styles/components/global/header.module.scss";

export default function InfoPopup(props: {
    setShowPopup: Dispatch<SetStateAction<boolean>>;
    setShowAd: Dispatch<SetStateAction<boolean>>;
}) {
    const scrollPosition = useRef(0);

    // refs to DOM nodes
    const htmlRef = useRef<HTMLElement | null>(null);
    const bodyRef = useRef<HTMLElement | null>(null);
    const headerRef = useRef<HTMLElement | null>(null);
    const mobileNavRef = useRef<HTMLElement | null>(null);

    // refs to previous inline styles
    const prevHtml = useRef<{ overflow: string; marginRight: string; overscrollBehaviorY: string }>({
        overflow: "",
        marginRight: "",
        overscrollBehaviorY: "",
    });
    const prevBody = useRef<{ position: string }>({ position: "" });
    const prevHeaderDisplay = useRef<string | null>(null);
    const prevMobileNavDisplay = useRef<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined" || typeof document === "undefined") return;

        // guard clarity
        try {
            (window as any).clarity?.("set", "AdPopup", "true");
        } catch {}

        scrollPosition.current = window.scrollY;

        const htmlEl = document.documentElement;
        const bodyEl = document.body;
        const headerEl = document.querySelector("header") as HTMLElement | null;
        const mobileNavEl = document.querySelector(`.${headerStyles.mobileNav}`) as HTMLElement | null;

        htmlRef.current = htmlEl;
        bodyRef.current = bodyEl;
        headerRef.current = headerEl;
        mobileNavRef.current = mobileNavEl;

        // store previous inline styles
        prevHtml.current = {
            overflow: htmlEl.style.overflow,
            marginRight: htmlEl.style.marginRight,
            // TS doesn't know this property exists on style
            overscrollBehaviorY: (htmlEl.style as any).overscrollBehaviorY || "",
        };
        prevBody.current = { position: bodyEl.style.position };
        if (headerEl) prevHeaderDisplay.current = headerEl.style.display;
        if (mobileNavEl) prevMobileNavDisplay.current = mobileNavEl.style.display;

        // apply new styles
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        htmlEl.style.overflow = "hidden";
        (htmlEl.style as any).overscrollBehaviorY = "none"; // equals CSS 'overscroll-behavior-y'
        htmlEl.style.marginRight = `${scrollBarWidth}px`;

        if (window.innerWidth <= 768) {
            if (headerEl) headerEl.style.display = "none";
            if (mobileNavEl) mobileNavEl.style.display = "none";
        }

        return () => {
            const h = htmlRef.current;
            const b = bodyRef.current;

            if (h) {
                h.style.overflow = prevHtml.current.overflow;
                (h.style as any).overscrollBehaviorY = prevHtml.current.overscrollBehaviorY;
                h.style.marginRight = prevHtml.current.marginRight;
            }

            if (b) {
                b.style.position = prevBody.current.position;
            }

            const hdr = headerRef.current;
            if (hdr && prevHeaderDisplay.current !== null) {
                hdr.style.display = prevHeaderDisplay.current;
            }

            const mnav = mobileNavRef.current;
            if (mnav && prevMobileNavDisplay.current !== null) {
                mnav.style.display = prevMobileNavDisplay.current;
            }

            window.scrollTo(0, scrollPosition.current || 0);
        };
    }, []);

    return (
        <div className={reviewStyles.popup}>
            <div className={reviewStyles.popInside}>
                <div className={reviewStyles.popupContent}>
          <span className={reviewStyles.popupText}>
            Advertisements help us pay for website costs.
          </span>
                    <div className={reviewStyles.popupButtons}>
                        <button onClick={() => props.setShowAd(false)}>Hide advertisement</button>
                        <button onClick={() => props.setShowPopup(false)}>Ok</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
