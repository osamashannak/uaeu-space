import {Dispatch, SetStateAction} from "react";
import styles from "../../styles/components/global/modal.module.scss";

export default function AdvertisementModal(props: {
    setShowAd: Dispatch<SetStateAction<boolean>>,
    onClose: () => void,
}) {

    return (
        <div className={styles.background}>
            <div className={styles.modalBody}>

          <span className={styles.text}>
            Advertisements help us pay for website costs.
          </span>
                <div className={styles.modalButtons}>
                    <button className={styles.buttonOk} onClick={() => {
                        props.setShowAd(false)
                        props.onClose()
                    }}>Hide advertisement
                    </button>
                    <button className={styles.buttonOk} onClick={() => {
                        props.onClose()
                    }}>Ok
                    </button>
                </div>
            </div>
        </div>
    );
}
