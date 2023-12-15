"use client";

import {formatRelativeTime, parseText, ratingToIcon} from "@/utils";
import styles from "@/styles/components/Review.module.scss";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {ReviewAPI} from "@/interface/professor";
import {DashboardReviewAPI} from "@/interface/dashboard";
import Rating from "@/components/Professor/Rating";
import {default as NextImage} from "next/image";

dayjs.extend(relativeTime)


const Review = (props: ReviewAPI | DashboardReviewAPI) => {

    let attachment_url = "https://uaeuresources.blob.core.windows.net/attachments/" + props.attachment?.id;

    return (
        <article className={styles.review}>

            <div className={styles.reviewInfo}>
                <div className={styles.reviewInfoLeft}>
                    <div className={styles.authorName}>
                        <span>{props.author}</span>
                    </div>
                    <div className={"text-separator"}>
                        <span>·</span>
                    </div>
                    <time
                        dateTime={props.created_at.toString()}
                        title={dayjs(props.created_at).format("MMM D, YYYY h:mm A")}
                        className={styles.time}
                    >{formatRelativeTime(new Date(props.created_at))}</time>
                </div>
                <div className={styles.reviewInfoRight}>
                    <div>
                        <span>{props.positive ? "Recommend" : "Not recommended"}</span>
                    </div>
                    <div>
                        <span title={props.score.toString()}>{ratingToIcon(props.score)}</span>
                    </div>
                </div>
            </div>

            <div className={styles.reviewBody}>

                <p dir={"auto"} dangerouslySetInnerHTML={{__html: parseText(props.comment)}}/>

                <div className={styles.imageList}>
                    {
                        props.attachment &&
                        <div className={styles.attachment} onClick={() => {
                            window.open(attachment_url, '_blank');
                        }}>
                            <div
                                style={{paddingBottom: `${props.attachment.height / props.attachment.width * 100}%`}}></div>
                            <div style={{backgroundImage: `url(${attachment_url})`}} className={styles.imageDiv}>
                            </div>
                            <NextImage src={attachment_url}
                                       draggable={false}
                                       width={100}
                                       height={100}
                                       alt={""}/>
                        </div>
                    }
                </div>
            </div>

            <div className={styles.reviewFooter}>
                <div>
                    <Rating dislikes={props.dislikes} likes={props.likes} id={props.id} type={"review"}/>
                </div>
            </div>

        </article>
    );
}

export default Review;