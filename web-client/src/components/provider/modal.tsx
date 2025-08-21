import {ComponentType, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {ModalContext} from "../../context/modal.ts";

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<{
        Component: ComponentType<any>;
        props: Record<string, any>;
    } | null>(null);

    const scrollPosition = useRef(0);
    const prevStyles = useRef<Map<HTMLElement, Partial<CSSStyleDeclaration>>>(new Map());

    const openModal = (Component: ComponentType<any>, props: Record<string, any> = {}) => {
        setModal({ Component, props });
    };

    const closeModal = () => setModal(null);

    useEffect(() => {
        if (!modal) return;

        scrollPosition.current = window.scrollY;

        const html = document.documentElement;
        const body = document.body;
        const header = document.querySelector("header") as HTMLElement | null;
        const mobileNav = document.querySelector(".mobileNav") as HTMLElement | null;

        const elements = [html, body, header, mobileNav].filter(Boolean) as HTMLElement[];

        // Save previous inline styles
        elements.forEach(el => {
            prevStyles.current.set(el, {
                overflow: el.style.overflow,
                marginRight: el.style.marginRight,
                position: el.style.position,
                display: el.style.display,
                overscrollBehaviorY: (el.style as any).overscrollBehaviorY,
            });
        });

        // Apply modal-specific styles
        const scrollBarWidth = window.innerWidth - html.clientWidth;
        html.style.overflow = "hidden";
        (html.style as any).overscrollBehaviorY = "none";
        html.style.marginRight = `${scrollBarWidth}px`;

        if (window.innerWidth <= 768) {
            if (header) header.style.display = "none";
            if (mobileNav) mobileNav.style.display = "none";
        }

        return () => {
            // Restore previous styles
            elements.forEach(el => {
                const prev = prevStyles.current.get(el);
                if (prev) {
                    if ("overflow" in prev) el.style.overflow = prev.overflow || "";
                    if ("marginRight" in prev) el.style.marginRight = prev.marginRight || "";
                    if ("position" in prev) el.style.position = prev.position || "";
                    if ("display" in prev) el.style.display = prev.display || "";
                    if ("overscrollBehaviorY" in prev) (el.style as any).overscrollBehaviorY = prev.overscrollBehaviorY || "";
                }
            });

            window.scrollTo(0, scrollPosition.current || 0);
        };
    }, [modal]);

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {modal &&
                createPortal(
                    <modal.Component {...modal.props} onClose={closeModal} />,
                    document.body
                )}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("useModal must be used within ModalProvider");
    return ctx;
}