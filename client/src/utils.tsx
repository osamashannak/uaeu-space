import icons from "@/icons";

export const HOST = "https://api.uaeu.space";

const FullStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
        <path fill="currentColor"
              d="m5.825 22l1.625-7.025L2 10.25l7.2-.625L12 3l2.8 6.625l7.2.625l-5.45 4.725L18.175 22L12 18.275Z"/>
    </svg>
)
const HalfStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
        <path fill="currentColor"
              d="M12 8.125v7.8l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325ZM5.825 22l1.625-7.025L2 10.25l7.2-.625L12 3l2.8 6.625l7.2.625l-5.45 4.725L18.175 22L12 18.275Z"/>
    </svg>
)
const EmptyStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
        <path fill="currentColor"
              d="m8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425ZM5.825 22l1.625-7.025L2 10.25l7.2-.625L12 3l2.8 6.625l7.2.625l-5.45 4.725L18.175 22L12 18.275ZM12 13.25Z"/>
    </svg>
)

export const ratingToIcon = (rating: number) => {
    let i;
    rating = Math.round(rating * 2) / 2;
    let output = [];

    for (i = rating; i >= 1; i--) {
        output.push(<FullStar/>);
    }
    if (i === .5) {
        output.push(<HalfStar/>);
    }
    for (let i = (5 - rating); i >= 1; i--) {
        output.push(<EmptyStar/>);
    }

    return output;
}

export const formatBytes = (bytes: number, decimals: number = 1) => {
    if (!+bytes) return '0 B'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const iconClasses = {
    // Media
    "image": icons.image,
    "audio": icons.audio,
    "video": icons.video,
    // Documents
    "application/pdf": icons.pdf,
    "application/msword": icons.word,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": icons.word,
    "application/vnd.ms-powerpoint": icons.powerpoint,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": icons.powerpoint,
    "application/vnd.ms-excel": icons.excel,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": icons.excel,
    // Archives
    "application/gzip": icons.archive,
    "application/zip": icons.archive,
    "application/x-7z-compressed": icons.archive,
    "application/vnd.rar": icons.archive
};

export function getIconFromMIME(mimeType: string): JSX.Element {

    const candidate = Object.entries(iconClasses).find(([key, value]) => {
        return mimeType.startsWith(key);
    });

    if (candidate === undefined) {
        return icons.file;
    } else {
        return candidate[1];
    }
}

export const generateConfetti = (id: string) => {
    const random = (max: number) => {
        return Math.random() * max;
    }

    const c = document.createDocumentFragment();
    for (let i = 0; i < 10; i++) {
        const styles = 'transform: translate3d(' + (random(100) - 50) + 'px, ' + (random(100) - 50) + 'px, 0) rotate(' + random(360) + 'deg);\
                  background: hsla(' + random(360) + ',100%,50%,1);\
                  animation: bang 500ms ease-out forwards;\
                  opacity: 0';

        const e = document.createElement("i");
        e.style.cssText = styles.toString();
        e.className = "confetti";

        c.appendChild(e);
    }

    const element = document.getElementById(id)!;
    element.appendChild(c);

    setTimeout(() => {
        document.querySelectorAll(".confetti").forEach(function (c) {
            c.parentNode!.removeChild(c);
        });

    }, 10000);
}

export const convertArabicNumeral = (s: any) => s.replace(/[٠-٩]/g, (d: any) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))