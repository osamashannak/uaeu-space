import styles from "../../styles/components/professor/review_form.module.scss";
import {ChangeEvent, Dispatch, SetStateAction} from "react";
import Compressor from "compressorjs";
import {uploadAttachment, uploadVideoAttachment} from "../../api/professor.ts";
import {
    ImageAttachment,
    ReviewFormDraft,
    TenorGIFAttachment, VideoAttachment
} from "../../typed/professor.ts";
import GifPicker, {ContentFilter} from "gif-picker-react";


export default function ReviewFormFooter(props: {
    details: ReviewFormDraft,
    setDetails: Dispatch<SetStateAction<ReviewFormDraft>>
}) {

    const {details, setDetails} = props;

    const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {

        if (details.attachments.length >= 4) {
            alert("You may only choose 4 images or 1 GIF.");
            event.target.value = "";
            return;
        }

        const mimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

        const files = Array.from(event.target.files!).filter(file => mimeTypes.includes(file.type));

        event.target.value = "";

        if (files.length === 0) {
            alert("File type not supported.");
            return;
        }

        const emptySlots = 4 - details.attachments.length;

        const images = files.slice(0, emptySlots);

        if (images.length === 0) return;

        for (const image of images) {
            /*if (['video/mp4', 'video/quicktime'].includes(image.type)) {
                if (emptySlots !== 4) {
                    alert("You may only choose 4 images, 1 GIF or 1 video.");
                    continue;
                }

                addVideo(image);

                return;
            }*/

            if (['image/webp', 'image/gif'].includes(image.type)) {
                if (emptySlots !== 4) continue;

                addImage(image);
                event.target.value = "";

                return;
            }

            new Compressor(images[0], {
                quality: 0.8,
                success(compressedFile) {
                    addImage(compressedFile);
                },
                error() {
                    alert("Failed to upload the image.");
                },
            });
        }

        event.target.value = "";
    }

    function addVideo(file: File | Blob) {

        const video = document.createElement('video');

        video.onloadedmetadata = async () => {

            if (video.duration > 300) {
                alert("Video must be at most 5 minutes long.");
                return;
            }

            const attachment: VideoAttachment = {
                id: "UPLOADING",
                url: video.src,
                weight: 4,
                videoSrc: file,
                aspectRatio: video.videoHeight / video.videoWidth
            };

            setDetails(prevState => ({...prevState, attachments: [...prevState.attachments, attachment]}));


            const id = await uploadVideoAttachment(file);

            await verifyUpload(id, attachment.url);
        }

        video.src = URL.createObjectURL(file);

    }

    function addTenorGif(gif: string) {
        const img = new Image();
        img.src = gif;

        img.onload = async () => {
            const attachment: TenorGIFAttachment = {
                id: gif,
                url: gif,
                aspectRatio: img.height / img.width,
                weight: 4
            };

            setDetails(prevState => ({...prevState, attachments: [...prevState.attachments, attachment]}));
        }
    }

    function addImage(file: File | Blob) {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = async () => {
            if (img.height < 50 || img.width < 50) {
                alert("Image must be at least 50 pixels in width and height.");
                return;
            }

            if (img.height > 16000 || img.width > 16000) {
                alert("Image must be at most 16000 pixels in width and height.");
                return;
            }

            const attachment = {
                id: "READY",
                url: img.src,
                aspectRatio: img.height / img.width,
                weight: 1,
                src: file
            } as ImageAttachment;

            setDetails(prevState => ({...prevState, attachments: [...prevState.attachments, attachment]}));



        }
    }

    function canAddMoreAttachments() {
        return details.attachments.reduce((acc, attachment) => acc + attachment.weight, 0) < 4;
    }

    function canAddGif() {
        return details.attachments.reduce((acc, attachment) => acc + attachment.weight, 0) === 0;
    }

    function hideEmojiSelector() {
        const emojiSelector = document.querySelector(`.${styles.emojiSelector}`) as HTMLDivElement;
        emojiSelector.style.opacity = "0";
        emojiSelector.style.pointerEvents = "none";
    }

    function hideGifSelector() {
        const gifSelector = document.querySelector(`.${styles.gifSelector}`) as HTMLDivElement;
        gifSelector.style.opacity = "0";
        gifSelector.style.pointerEvents = "none";
    }


    document.body.onclick = () => {
        hideEmojiSelector();
        hideGifSelector();
    }


    return (
        <div className={styles.postFooter}>
            <div
                className={styles.postButtonList}
                onClick={event => {
                    event.stopPropagation();
                }}>

                <div className={styles.gifSelector} onClick={e => e.stopPropagation()}>
                    <GifPicker tenorApiKey={"AIzaSyDmHmE9bzvu54NGyozlJFwHCwtpOFQiVng"}
                               contentFilter={ContentFilter.HIGH}
                               onGifClick={(gif) => {
                                   addTenorGif(gif.url);
                                   hideGifSelector();
                               }}/>
                </div>
                <div className={canAddMoreAttachments() ? styles.buttonIconWrapper : styles.disabledButton}>
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
                <div className={canAddGif() ? styles.buttonIconWrapper : styles.disabledButton}>
                    <div className={styles.buttonLabel} onClick={(e) => {
                        e.stopPropagation();
                        hideEmojiSelector();
                        const gifSelector = document.querySelector(`.${styles.gifSelector}`) as HTMLDivElement;
                        gifSelector.style.opacity = "1";
                        gifSelector.style.pointerEvents = "all";
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M19 19H5V5h14zM5 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm6.5 11h1v-4h-1zm2 0h1v-1.5H16v-1h-1.5V11h2v-1h-3zm-4-2v1h-1v-2h2c0-.55-.45-1-1-1h-1c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1z"/>
                        </svg>
                    </div>
                </div>
                <div className={styles.buttonIconWrapper}>
                    <div className={styles.buttonLabel} onClick={(e) => {
                        e.stopPropagation();
                        hideGifSelector();
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
    )
}