import {ReactNode} from "react";
import styles from "../styles/layout.module.scss";
import Header from "../components/header.tsx";
import Footer from "../components/footer.tsx";

export default function Layout({children}: { children: ReactNode }) {
    return (
        <>
            <Header/>

            <main>
                {children}
            </main>

            <Footer/>

            <div className={styles.right}/>

        </>
    )
}