import React, {useEffect} from 'react';
import {useRouter} from 'next/router'

declare const window: any;

type ResponsiveAdUnitProps = {
    slotId: number;
    type?: string;
    style?: any;
};

const initAd = () => {
    try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.log(e);
    }
};

export function ResponsiveAdUnit({
                                     slotId,
                                     type = "default-ad-unit-type",
                                     style = {}
                                 }: ResponsiveAdUnitProps): JSX.Element | null {

    useEffect(() => {
        initAd();
    })

    const router = useRouter()

    style.display = "block";
    if (style.marginTop === undefined) style.marginTop = "2rem";

    return (
        <div key={router.asPath.replace(/\//g, "-") + "-" + slotId + "-" + type} style={style}>
            <center>
                <ins
                    className="adsbygoogle"
                    style={{display: 'block'}}
                    data-ad-client={`ca-pub-3857934898455258`}
                    data-ad-slot={String(slotId)}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </center>
        </div>
    );
}