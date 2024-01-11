import {ReactNode} from "react";
import styles from "../styles/Layout.module.scss";

export default function Layout({children}: { children: ReactNode }) {
    return (
        <>
            {/*<Header/>*/}

            <main>
                <div className={"main"}>
                    {children}
                </div>
            </main>

            {/*<Footer/>*/}

            <div className={styles.right}/>

        </>
    )
}