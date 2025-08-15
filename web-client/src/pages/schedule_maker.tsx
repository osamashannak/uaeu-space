import styles from "../styles/pages/schedule_maker.module.scss";

export default function ScheduleMaker() {

    return (
        <>

            <h1>AI-Powered Schedule Maker</h1>

            <div className={styles.searchBoxWrapper} onClick={(e) => {
                const input = e.currentTarget.querySelector("input");
                if (input) {
                    input.focus();
                }
            }}>
                <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                     viewBox="0 0 24 24">
                    <path fill="currentColor"
                          d="m18.9 20.3l-5.6-5.6q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.625 5.625q.275.275.275.675t-.3.7q-.275.275-.7.275t-.7-.275ZM9.5 14q1.875 0 3.188-1.313T14 9.5q0-1.875-1.313-3.188T9.5 5Q7.625 5 6.312 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14Z"/>
                </svg>

                <div className={styles.searchBox}>
                    <input className={styles.searchBoxInput} type={"text"} placeholder={"Search Fall 2025 Courses"}/>
                </div>

            </div>
            <div className={styles.sectionPreview}>
                <div>
                    <div className={styles.sectionCourse}>
                        <span className={styles.courseTag}>CSBP431 </span>
                        <span>Bioinformatics</span>
                    </div>

                    <div className={styles.sectionDoctor}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18"/>
                        </svg>

                        <span>Hany Al Ashwal</span>
                    </div>

                    <div className={styles.sectionBuilding}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24">
                            <g className="building-outline">
                                <g fill="currentColor" className="Vector">
                                    <path fill-rule="evenodd"
                                          d="M8 5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3zm3-1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"
                                          clip-rule="evenodd"/>
                                    <path fill-rule="evenodd"
                                          d="M2 11a3 3 0 0 1 3-3h4.5v2H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.5v2H5a3 3 0 0 1-3-3z"
                                          clip-rule="evenodd"/>
                                    <path fill-rule="evenodd" d="M12 17a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3h-2v-3h-2v3h-2z"
                                          clip-rule="evenodd"/>
                                    <path
                                        d="M12 6a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm0 5a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm-7 4a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm11-9a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm0 5a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0z"/>
                                </g>
                            </g>
                        </svg>

                        <span>H2 - LAW 0015</span>
                    </div>
                </div>

                <div className={styles.addButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                        <path fill="currentColor"
                              d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"/>
                    </svg>
                    <span>Add</span>
                </div>


            </div>



        </>
    )

}