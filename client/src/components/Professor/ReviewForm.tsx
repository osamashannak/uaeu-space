import styles from "@/styles/components/ReviewForm.module.scss";
import {useEffect, useState} from "react";

const ReviewForm = (props: { professorEmail: string }) => {

    const [cookies, setCookies] = useState("");

    let lengthStyle = styles.commentLength;

    useEffect(() => {
        const cookies = Object.entries(localStorage).map(([key, value]) => ({key, value}));
        setCookies(JSON.stringify(cookies));
    }, []);

    return (
        <section className={styles.dform}>

            <div className={styles.d}>
                <div className={styles.postEditor}>
                    <div>
                        {
                            <div className={styles.postPlaceholder}>
                                <span>What was your experience?</span>
                            </div>
                        }
                    </div>

                    <div dir={"auto"} contentEditable className={styles.postContent}>
                    </div>
                </div>

                <div className={lengthStyle}>
                    <div>
                        <span>0 / 350</span>
                    </div>
                </div>

                <div className={styles.postFooter}>
                    <div
                        className={styles.postButtonList}
                        onClick={event => {
                            event.stopPropagation();
                        }}>
                        <div className={styles.buttonIconWrapper}>
                            <label className={styles.buttonLabel} htmlFor={"upload-images"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                          d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Zm0-2h14V5H5v14Zm1-2h12l-3.75-5l-3 4L9 13l-3 4Zm-1 2V5v14Z"/>
                                </svg>
                            </label>
                        </div>
                        <input className={styles.imageUploadHTML}
                               accept={"image/jpeg,image/png,image/webp,image/gif"} multiple
                               tabIndex={-1} type={"file"} id={"upload-images"}/>
                    </div>
                </div>


                <div className={styles.formOptions}>
                    <div
                        onClick={event => {
                            event.stopPropagation();
                        }}
                        className={styles.score}>
                        <span>Score: </span>
                        <input
                            required maxLength={1}
                            id={"score-field"}
                            inputMode={"numeric"}
                            placeholder={"#"}
                            type={"text"}
                            className={styles.reviewFormScore}/>
                        <span> /5</span>
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
                                Not recommended
                            </label>
                        </li>
                    </ul>
                </div>
            </div>

            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: "12px",
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 256 256">
                    <path fill="currentColor"
                          d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m16-40a8 8 0 0 1-8 8a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m-32-92a12 12 0 1 1 12 12a12 12 0 0 1-12-12"/>
                </svg>
                <span style={{}}>Go to <a
                    href={"https://spaceread.net/professor/" + props.professorEmail + "?mig=" + btoa(cookies)}
                    className={styles.spaceread}>SpaceRead</a> to write a review!</span>
            </div>
        </section>
    );
}

export default ReviewForm;