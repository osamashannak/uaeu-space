import React, {ReactNode} from "react";
import styles from "../styles/layout.module.scss";
import Header from "../components/header.tsx";
import Footer from "../components/footer.tsx";
import ScrollToTop from "../components/scrolltotop.tsx";

export default function Layout({children}: { children: ReactNode }) {
    return (
        <>
            <Header/>

            <ScrollToTop/>
            <main>
                {children}
            </main>



            <Footer/>

            <div className={styles.right}/>

        </>
    )
}