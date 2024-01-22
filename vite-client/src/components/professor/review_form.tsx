import {ChangeEvent, useEffect, useRef, useState} from "react";
import {GoogleReCaptchaProvider, useGoogleReCaptcha} from "react-google-recaptcha-v3";
import styles from "../../styles/components/professor/review_form.module.scss";
import Compressor from 'compressorjs';
import {ReviewFormDraft} from "../../typed/professor.ts";
import {postReview, uploadAttachment} from "../../api/professor.ts";
import {convertArabicNumeral} from "../../utils.tsx";
import EmojiPicker, {EmojiStyle, Theme} from 'emoji-picker-react';
import {Link} from "react-router-dom";

export default function ReviewForm(props: { professorEmail: string }) {

    const [details, setDetails] = useState<ReviewFormDraft>({
        score: undefined,
        comment: "",
        positive: undefined,
        attachment: [],
    });
    const [submitting, setSubmitting] = useState<boolean | null | "error" | "loading">(localStorage.getItem(`${props.professorEmail}-prof`) ? null : false);
    const {executeRecaptcha} = useGoogleReCaptcha();
    const cursorPositionRef = useRef<Range | null>(null);
    const uploadInputRef = useRef<boolean>(false);

    const commentRef = useRef<string>("");

    const formFilled = () => {
        return (
            (details.comment
                && details.comment.trim()
                && details.comment.length <= 350 || details.attachment.length > 0) &&
            details.score &&
            details.positive !== undefined);
    }

    const invalidRadioSubmission = (event: any) => {
        event.currentTarget.setCustomValidity("Please select one of these options.");
    }

    const storeCursorPosition = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            cursorPositionRef.current = range.cloneRange();
        }
    }

    const restoreCursorPosition = () => {
        if (cursorPositionRef.current) {
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(cursorPositionRef.current);
            }
        }
    }

    const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (details.attachment.length > 0) {
            alert("You may only upload one image.");
            uploadInputRef.current = false;
            return;
        }

        if (uploadInputRef.current) {
            alert("Please wait for the image to upload.");
            event.target.value = "";
            return;
        }

        uploadInputRef.current = true;

        const mimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

        const files = Array.from(event.target.files!).filter(file => mimeTypes.includes(file.type));

        event.target.value = "";

        if (files.length === 0) {
            alert("File type not supported.");
            uploadInputRef.current = false;
            return;
        }

        const images = Array.from(files).slice(0, 1);

        if (images.length === 0) return;

        function addImage(file: File | Blob) {
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = async () => {

                if (img.height < 50 || img.width < 50) {
                    alert("Image must be at least 50 pixels in width and height.");
                    uploadInputRef.current = false;
                    return;
                }

                if (img.height > 16000 || img.width > 16000) {
                    alert("Image must be at most 16000 pixels in width and height.");
                    uploadInputRef.current = false;
                    return;
                }

                details.attachment.push({
                    id: "UPLOADING",
                    file,
                    url: img.src,
                    aspectRatio: img.height / img.width
                });

                const index = details.attachment.length - 1;

                setDetails({...details});

                const id = await uploadAttachment(file);

                if (id === undefined) {
                    alert("Failed to upload the image.");
                    setDetails((prevDetails) => ({
                        ...prevDetails,
                        attachment: prevDetails.attachment?.filter((_, i) => i !== details.attachment.length - 1),
                    }));
                    uploadInputRef.current = false;
                    return;
                }

                if (uploadInputRef.current && details.attachment[index].url === img.src) {
                    details.attachment[index].id = id;
                    setDetails({...details});
                    uploadInputRef.current = false;
                }

            }
        }

        if (images[0].type !== "image/gif" && images[0].type !== "image/webp" && images[0].size > 4 * 1000 * 1000) {
            new Compressor(images[0], {
                quality: 0.8,
                success(compressedFile) {
                    if (compressedFile.size > 4 * 1000 * 1000) {
                        alert("Image size is too large.");
                        uploadInputRef.current = false;
                        return;
                    }
                    addImage(compressedFile);
                },
                error() {
                    alert("Failed to upload the image.");
                    event.target.value = "";
                    uploadInputRef.current = false;
                },
            });
            return;
        } else if (images[0].type === "image/gif" && images[0].size > 4 * 1000 * 1000) {
            alert("GIFs must be under 4MB.");
            uploadInputRef.current = false;
            return;
        }

        addImage(images[0]);
    }

    const handleSubmit = async () => {
        setSubmitting(true);

        if (details.attachment.length > 0 && details.attachment[0].id === "UPLOADING") {
            setTimeout(handleSubmit, 500);
            return;
        }

        if (!executeRecaptcha) {
            setSubmitting("error");
            return;
        }

        const token = await executeRecaptcha("new_review");

        const status = await postReview({
            comment: details.comment!,
            score: details.score!,
            positive: details.positive!,
            professorEmail: props.professorEmail,
            recaptchaToken: token,
            attachments: details.attachment.map((attachment) => attachment.id)
        });

        if (!status) {
            setSubmitting("error");
            return;
        }

        localStorage.setItem(`${props.professorEmail}-prof`, 'true');
        setSubmitting(null);
    }

    if (submitting === null) {
        return (
            <section className={styles.form}>
                <span>You have submitted a review.</span>
            </section>
        )
    }

    if (submitting === "error") {
        return (
            <section className={styles.form}>
                <span>There was an error submitting your review. Please try again later.</span>
            </section>
        )
    }

    if (submitting === "loading") {
        return (
            <section className={styles.form}>
                <span>Loading...</span>
            </section>
        )
    }

    if (submitting) {
        return (
            <section className={styles.form}>
                <span>Submitting your review...</span>
            </section>
        )
    }

    let lengthStyle = styles.commentLength;

    if (details.comment && details.comment.length > 350) {
        lengthStyle += ` ${styles.commentLengthWarning}`;
    } else if (details.comment && details.comment.length == 350) {
        lengthStyle += ` ${styles.commentLengthPerfect}`;
    } else if (details.comment && details.comment.length < 350) {
        lengthStyle += ` ${styles.commentLengthGood}`;
    }

    document.body.onclick = () => {
        const emojiSelector = document.querySelector(`.${styles.emojiSelector}`) as HTMLDivElement;
        if (emojiSelector) {
            emojiSelector.style.opacity = "0";
            emojiSelector.style.pointerEvents = "none";
        }
    }


    return (
        <GoogleReCaptchaProvider
            reCaptchaKey="6Lf8FeElAAAAAJX3DVLxtBSEydXx0ln7KscspOZ8"
            useEnterprise={true}
            scriptProps={{
                async: true
            }}>

            <section
                className={styles.form}
                onClick={event => {
                    event.preventDefault();
                    const selection = window.getSelection();
                    const input = document.querySelector(`.${styles.postContent}`) as HTMLDivElement;

                    if (!selection || (selection.rangeCount > 0 && selection.getRangeAt(0).startOffset >= selection.getRangeAt(0).endOffset)) {
                        input.focus();
                    }
                }}>

                <div>
                    <div className={styles.guestWarning} onClick={(e) => {
                        e.stopPropagation();

                        const warningWindow = document.querySelector(`.${styles.fullscreenWarning}`) as HTMLDivElement;
                        warningWindow.style.display = "flex";
                        document.body.style.overflow = "hidden";
                        document.body.style.height = `calc(100vh - 160px)`;
                    }}>
                        <span>You are not logged in</span>
                        <div className={styles.infoButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                      d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8q0-.425-.288-.712T12 7q-.425 0-.712.288T11 8q0 .425.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20m0-8"/>
                            </svg>
                        </div>
                    </div>

                    <div className={styles.fullscreenWarning} onClick={(e) => {
                        e.stopPropagation();
                        const warningWindow = document.querySelector(`.${styles.fullscreenWarning}`) as HTMLDivElement;
                        warningWindow.style.display = "none";
                        document.body.style.overflow = "auto";
                        document.body.style.height = "auto";
                    }}>
                        <div className={styles.warningWindow} onClick={(e) => {
                            e.stopPropagation();
                        }}>
                            <h3>Logging in will allow you to:</h3>
                            <div className={styles.list}>
                                <p className={styles.element}>1. Edit your reviews 12 hours after submitting</p>
                                <p className={styles.element}>2. Delete your reviews at any time</p>
                            </div>
                            <h5>Your reviews will always be anonymous</h5>
                            <Link className={styles.warningButton} to={"/login"}>Login</Link>
                        </div>

                    </div>
                </div>


                <div className={styles.postEditor}>
                    <div>
                        {
                            <div className={styles.postPlaceholder}>
                                <span>What was your experience?</span>
                            </div>
                        }
                    </div>

                    <div
                        onInput={(event) => {
                            storeCursorPosition();

                            const target = event.target as HTMLDivElement;

                            commentRef.current = target.innerHTML;

                            const placeholder = document.querySelector(`.${styles.postPlaceholder}`) as HTMLDivElement;
                            placeholder.style.display = commentRef.current.length === 0 ? "block" : "none";
                            console.log(commentRef.current)

                        }}
                        onSelect={storeCursorPosition}
                        onFocus={restoreCursorPosition} dir={"auto"} contentEditable className={styles.postContent}>
                    </div>
                </div>

                <div className={lengthStyle}>
                    <div>
                        {(details.comment ?? "").trim().length > 0 ?
                            <span>{details.comment?.length} </span>
                            : <span>0 </span>}
                        <span>/ 350</span>
                    </div>
                </div>

                {details.attachment && <div className={styles.imagesPreviewList}>
                    {details.attachment.map((attachment, index) => {
                        return (
                            <div key={attachment.file.size + index} className={styles.imagePreview} onClick={event => {
                                event.stopPropagation();
                                window.open(attachment.url, '_blank');
                            }}>
                                <div className={styles.deleteButton}
                                     onClick={(event) => {
                                         event.stopPropagation();
                                         setDetails((prevDetails) => ({
                                             ...prevDetails,
                                             attachment: prevDetails.attachment?.filter((_, i) => i !== index),
                                         }));
                                         uploadInputRef.current = false;
                                         URL.revokeObjectURL(attachment.url);
                                     }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 256 256">
                                        <path fill="currentColor"
                                              d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/>
                                    </svg>
                                </div>
                                <div style={{paddingBottom: `${attachment.aspectRatio * 100}%`}}></div>
                                <div style={{backgroundImage: `url(${attachment.url})`}} className={styles.imageDiv}>
                                </div>
                                <img src={attachment.url}
                                     draggable={false}
                                     width={100}
                                     height={100}
                                     alt={""}/>
                            </div>
                        )
                    })}
                </div>}

                <div className={styles.emojiSelector} onClick={(e) => e.stopPropagation()}>
                    <EmojiPicker
                        height={400}
                        width={400}
                        previewConfig={{showPreview: false}}
                        theme={Theme.LIGHT}
                        emojiStyle={EmojiStyle.NATIVE}
                        onEmojiClick={(emojiData, event) => {

                            commentRef.current = commentRef.current.slice(0, cursorPositionRef.current?.startOffset) + emojiData.emoji + commentRef.current.slice(cursorPositionRef.current?.startOffset);
                            const placeholder = document.querySelector(`.${styles.postPlaceholder}`) as HTMLDivElement;
                            placeholder.style.display = commentRef.current.length === 0 ? "block" : "none";

                            const postContent = document.querySelector(`.${styles.postContent}`) as HTMLDivElement;


                            postContent.innerHTML = commentRef.current;


                        }}
                    />
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
                            <input className={styles.imageUploadHTML}
                                   onChange={(event) => {
                                       uploadImage(event);
                                   }}
                                   accept={"image/jpeg,image/png,image/webp,image/gif"} multiple
                                   tabIndex={-1} type={"file"} id={"upload-images"}/>
                        </div>
                        <div className={styles.buttonIconWrapper}>
                            <div className={styles.buttonLabel} onClick={(e) => {
                                e.stopPropagation();
                                const emojiSelector = document.querySelector(`.${styles.emojiSelector}`) as HTMLDivElement;
                                emojiSelector.style.opacity = "1";
                                emojiSelector.style.pointerEvents = "all";
                            }}>
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
                            onChange={
                                event => {
                                    event.target.value = convertArabicNumeral(event.target.value);
                                    if ((/[^1-5]/g.test(event.target.value))) {
                                        event.target.setCustomValidity("Enter a number 1-5.");
                                        event.target.value = event.target.value.replace(/[^1-5]/g, '')
                                        details.score = undefined;
                                        setDetails({...details});
                                    } else {
                                        event.target.setCustomValidity("");
                                        details.score = parseInt(event.target.value);
                                        setDetails({...details});
                                    }
                                    event.target.reportValidity();
                                }
                            }
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
                                       onChange={() => {
                                           details.positive = true;
                                           setDetails({...details});
                                       }}
                                       onInvalid={invalidRadioSubmission}
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
                                    onChange={() => {
                                        details.positive = false;
                                        setDetails({...details});
                                    }}
                                    type="radio"
                                    className={styles.radioTwo}
                                    name="recommendation"
                                    value="negative"/>
                                Not recommended
                            </label>
                        </li>
                    </ul>
                </div>

                <input type={"submit"}
                       title={"Submit"}
                       className={formFilled() ? styles.enabledFormSubmit : styles.disabledFormSubmit}
                       value={"Submit"}
                       onClick={async event => {
                           event.stopPropagation();
                           if (!formFilled()) {
                               const invalidFields = Array.from(document.querySelectorAll("input:invalid"));
                               const score = invalidFields.find(field => field.id === "score-field");

                               if (score) {
                                   // @ts-ignore
                                   score.reportValidity();
                                   return;
                               }

                               if (invalidFields.length > 1) {
                                   // @ts-ignore
                                   invalidFields[0].reportValidity();
                               }

                               return;
                           }
                           await handleSubmit();
                       }}/>

                <div className={styles.disclaimer}>
                    This site is protected by reCAPTCHA and the Google <a
                    href="https://policies.google.com/privacy" target={"_blank"}>Privacy Policy</a> and <a
                    href="https://policies.google.com/terms" target={"_blank"}>Terms of Service</a> apply.
                </div>
            </section>
        </GoogleReCaptchaProvider>
    );
}

