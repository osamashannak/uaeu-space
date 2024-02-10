import Slider, {Settings} from "react-slick";
import {ReviewFormDraft} from "../../typed/professor.ts";
import styles from "../../styles/components/professor/review_form.module.scss";
import {Dispatch, SetStateAction, useEffect} from "react";
import "../../styles/slider.scss";

export default function AttachmentSlider(props: {details: ReviewFormDraft, setDetails: Dispatch<SetStateAction<ReviewFormDraft>>}) {
    const {details, setDetails} = props;


    if (!details.attachments) return;


    const settings: Settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: details.attachments.length > 1,
        dots: details.attachments.length > 1,
        touchMove: details.attachments.length > 1,

    };

    return (
        <Slider {...settings}>
            {[...details.attachments].reverse().map((attachment, index) => {

                if ('videoSrc' in attachment) {


                    return (

                        <div key={attachment.id + index} className={styles.videoPreview}
                             style={{
                                 width: 1/attachment.aspectRatio * 680 + "px",
                             }}
                             onClick={event => {
                                 event.stopPropagation();
                             }}>
                            <div className={styles.deleteButton}
                                 onClick={(event) => {
                                     event.stopPropagation();
                                     setDetails((prevDetails) => ({
                                         ...prevDetails,
                                         attachments: prevDetails.attachments?.filter((_) =>  _.url !== attachment.url),
                                     }));
                                     URL.revokeObjectURL(attachment.url);
                                 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                     viewBox="0 0 256 256">
                                    <path fill="currentColor"
                                          d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/>
                                </svg>
                            </div>
                            <div style={{paddingBottom: `${attachment.aspectRatio * 100}%`}}></div>
                            <div className={styles.videoDiv}>
                                <video autoPlay loop controls playsInline muted>
                                    <source src={attachment.url} type={attachment.videoSrc.type}/>
                                </video>
                            </div>
                        </div>

                    );
                }

                return (
                    <>
                        <div key={attachment.id + index} className={styles.imagePreview}
                             onClick={event => {
                                 event.stopPropagation();
                                 //window.open(attachment.url, '_blank');
                             }}>
                            <div className={styles.deleteButton}
                                 onClick={(event) => {
                                     event.stopPropagation();
                                     setDetails((prevDetails) => ({
                                         ...prevDetails,
                                         attachments: prevDetails.attachments?.filter((_) => _.url !== attachment.url),
                                     }));
                                     URL.revokeObjectURL(attachment.url);
                                 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                     viewBox="0 0 256 256">
                                    <path fill="currentColor"
                                          d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/>
                                </svg>
                            </div>
                            <div style={{paddingBottom: `${attachment.aspectRatio * 100}%`}}></div>
                            <div style={{backgroundImage: `url(${attachment.url})`}}
                                 className={styles.imageDiv}>
                            </div>
                            <img src={attachment.url}
                                 draggable={false}
                                 width={100}
                                 height={100}
                                 alt={""}/>
                        </div>
                        <div>
                            {attachment.id.includes("tenor") &&
                                <span>Via Tenor</span>
                            }
                        </div>
                    </>
                )
            })}
        </Slider>
    );

}