import reviewStyles from "../../styles/components/professor/review.module.scss";
import {useState} from "react";
import {useModal} from "../provider/modal.tsx";
import AdvertisementModal from "../modal/advertisement_modal.tsx";

interface ReviewAdProps {
    adUrl: string;
    text?: string;
    imageHeight: number;
    imageWidth: number;
    urlText?: string;
}

export default function ReviewAd(props: ReviewAdProps) {

    const [showAd, setShowAd] = useState(true);
    const modal = useModal();

    if (!showAd) {
        return null;
    }

    function shortenUrl(url: string) {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        const path = urlObj.pathname;
        const query = urlObj.search;

        if (path.length > 14) {
            return `${domain}${path.slice(0, 12)}...${query}`;
        }

        return `${domain}${path}${query}`;
    }

    const advertisement = 'https://uaeuspace.spaceread.net/advertisement';


    return (
        <>
            <div>
                <article className={reviewStyles.review}>
                    <div className={reviewStyles.reviewInfo}>

                        <div className={reviewStyles.reviewInfoLeft}>
                            <div className={reviewStyles.reviewInfoLeftTop}>
                                <div className={reviewStyles.authorName}>
                                    Advertisement
                                </div>
                                <div className={reviewStyles.infoButton} onClick={() => {
                                    modal.openModal(AdvertisementModal, {
                                        setShowAd: setShowAd
                                    })
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em"
                                         viewBox="0 0 256 256">
                                        <path fill="currentColor"
                                              d="M140 180a12 12 0 1 1-12-12a12 12 0 0 1 12 12M128 72c-22.06 0-40 16.15-40 36v4a8 8 0 0 0 16 0v-4c0-11 10.77-20 24-20s24 9 24 20s-10.77 20-24 20a8 8 0 0 0-8 8v8a8 8 0 0 0 16 0v-.72c18.24-3.35 32-17.9 32-35.28c0-19.85-17.94-36-40-36m104 56A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88"/>
                                    </svg>
                                </div>

                            </div>
                        </div>


                    </div>

                    <div className={reviewStyles.reviewBody}>

                        <p dir={"auto"}>
                            {props.text}
                            {props.urlText &&
                                <a className={reviewStyles.adUrl} rel={"nofollow"} target={"_blank"} role={"link"} href={advertisement}>
                                    <span>{shortenUrl(props.urlText)}</span>
                                </a>
                            }
                        </p>

                        <div className={reviewStyles.imageList}>
                            <div className={reviewStyles.attachment} onClick={() => {
                                window.open(advertisement, "_blank");
                            }}>
                                <div
                                    style={{paddingBottom: `${props.imageHeight / props.imageWidth * 100}%`}}></div>
                                <div style={{backgroundImage: `url(${props.adUrl})`}}
                                     className={reviewStyles.imageDiv}>
                                </div>
                                <img src={props.adUrl}
                                     draggable={false}
                                     width={100}
                                     height={100}
                                     alt={""}/>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </>
    )


}