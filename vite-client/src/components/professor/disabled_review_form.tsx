import styles from "../../styles/components/professor/review_form.module.scss";


export default function DisabledReviewForm() {

    const width = window.innerWidth > 768 ? 600 : window.innerWidth;

    return (
        <>
            <div style={{width: width, height: "2px"}}></div>
            <section
                className={styles.reviewForm}
                onClick={event => {
                    event.preventDefault();
                }}>

                <div>
                    <div className={styles.disabledPostEditor}>
                        <div className={styles.postPlaceholder}>What was your experience?</div>
                        <div className={styles.postContentContainer}>
                            <div className={styles.postContent}>
                                <div className={styles.postParagraph}>
                                    <br/>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div className={styles.commentLength}>
                        <div>
                            <span>0</span>
                            <span>/ 350</span>
                        </div>
                    </div>
                </div>

                <div style={{marginTop: "8px"}}/>

                <div className={styles.postFooter}>
                    <div
                        className={styles.postButtonList}
                        onClick={event => {
                            event.stopPropagation();
                        }}>

                        <div className={styles.disabledButton}>
                            <label className={styles.buttonLabel} htmlFor={"upload-images"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                          d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Zm0-2h14V5H5v14Zm1-2h12l-3.75-5l-3 4L9 13l-3 4Zm-1 2V5v14Z"/>
                                </svg>
                            </label>
                            <input className={styles.imageUploadHTML}
                                   accept={"image/jpeg,image/png,image/webp,image/gif"} multiple
                                   tabIndex={-1} type={"file"} id={"upload-images"}/>
                        </div>
                        <div className={styles.disabledButton}>
                            <div className={styles.buttonLabel}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                          d="M19 19H5V5h14zM5 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm6.5 11h1v-4h-1zm2 0h1v-1.5H16v-1h-1.5V11h2v-1h-3zm-4-2v1h-1v-2h2c0-.55-.45-1-1-1h-1c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1z"/>
                                </svg>
                            </div>
                        </div>
                        <div className={styles.disabledButton}>
                            <div className={styles.buttonLabel}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <g fill="none">
                                        <path
                                            d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
                                        <path fill="currentColor"
                                              d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2Zm0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16Zm2.8 9.857a1 1 0 1 1 1.4 1.428A5.984 5.984 0 0 1 12 17a5.984 5.984 0 0 1-4.2-1.715a1 1 0 0 1 1.4-1.428A3.984 3.984 0 0 0 12 15c1.09 0 2.077-.435 2.8-1.143ZM8.5 8a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3Zm7 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3Z"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.disabledFormOptions}>
                    <div
                        onClick={event => {
                            event.stopPropagation();
                        }}
                        className={styles.score}>
                        <span style={{marginRight: "7.5px", fontWeight: 500}}>Score: </span>
                        <div className={styles.reviewScoreContainer}>
                            <input
                                required maxLength={1}
                                id={"score-field"}
                                inputMode={"numeric"}
                                placeholder={"#"}
                                type={"text"}
                                className={styles.reviewFormScore}/>
                            <span> /5</span>
                        </div>
                    </div>

                    <ul className={styles.reviewFormPositivityList}
                        onClick={event => {
                            event.stopPropagation();
                        }}>
                        <li>
                            <label>
                                <input required
                                       id={"main-rec-radio"}
                                       type="radio"
                                       className={styles.radioOne}
                                       name="recommendation"
                                       value="positive"/>
                                Recommend
                            </label>
                        </li>
                        <li>
                            <label>
                                <input
                                    type="radio"
                                    className={styles.radioTwo}
                                    name="recommendation"
                                    value="negative"/>
                                Do not recommend
                            </label>
                        </li>
                    </ul>
                </div>

                <div className={styles.submitButtonWrapper}>
                    <div title={"Post"}
                         className={styles.veryDisabledFormSubmit}>
                        <span>Post</span>
                    </div>
                </div>

                <div className={styles.disclaimer}>
                    This site is protected by reCAPTCHA and the Google <a
                    href="https://policies.google.com/privacy" target={"_blank"}>Privacy Policy</a> and <a
                    href="https://policies.google.com/terms" target={"_blank"}>Terms of Service</a> apply.
                </div>
            </section>
        </>
    )
}