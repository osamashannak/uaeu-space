import {useEffect, useRef, useState} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import styles from "@/styles/components/ReviewForm.module.scss";
import {postReview, uploadAttachment} from "@/api/professor";
import {ReviewForm} from "@/interface/professor";
import {convertArabicNumeral} from "@/utils";
import {default as NextImage} from "next/image";
import Compressor from 'compressorjs';

const ReviewForm = (props: { professorEmail: string }) => {

    const [details, setDetails] = useState<ReviewForm>({
        score: undefined,
        comment: "",
        positive: undefined,
        attachment: [],
    });
    const [submitting, setSubmitting] = useState<boolean | null | "error" | "loading">("loading");
    const {executeRecaptcha} = useGoogleReCaptcha();
    const cursorPositionRef = useRef<Range | null>(null);
    const uploadInputRef = useRef<boolean>(false);

    useEffect(() => {
        const hasSubmittedBefore = localStorage.getItem(`${props.professorEmail}-prof`);
        setSubmitting(hasSubmittedBefore ? null : false);
    }, [props.professorEmail]);

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

    if ((details.comment ?? "").trim()) {
        const length = (details.comment ?? "").trim().length;

        if (length > 350) {
            lengthStyle += ` ${styles.commentLengthWarning}`;
        } else if (length === 350) {
            lengthStyle += ` ${styles.commentLengthPerfect}`;
        } else if (length < 350) {
            lengthStyle += ` ${styles.commentLengthGood}`;
        }

    }

    return (
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
                        const target = event.target as HTMLDivElement;

                        setDetails((prevDetails) => ({
                            ...prevDetails,
                            comment: target.textContent || "",
                        }));

                        const placeholder = document.querySelector(`.${styles.postPlaceholder}`) as HTMLDivElement;
                        placeholder.style.display = target.textContent?.length === 0 ? "block" : "none";

                        storeCursorPosition();
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
                        <div key={attachment.file.name + index} className={styles.imagePreview} onClick={event => {
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                                    <path fill="currentColor"
                                          d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/>
                                </svg>
                            </div>
                            <div style={{paddingBottom: `${attachment.aspectRatio * 100}%`}}></div>
                            <div style={{backgroundImage: `url(${attachment.url})`}} className={styles.imageDiv}>
                            </div>
                            <NextImage src={attachment.url}
                                       draggable={false}
                                       width={100}
                                       height={100}
                                       alt={""}/>
                        </div>
                    )
                })}
            </div>}

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
                           onChange={(event) => {

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
                                   let img = new Image();
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

                           }}
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
    );
}

export default ReviewForm;