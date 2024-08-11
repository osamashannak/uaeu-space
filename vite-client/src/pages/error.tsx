import {useEffect} from "react";

export default function Error() {

    useEffect(() => {
        // @ts-expect-error Clarity is not defined
        clarity("set", "ErrorViewed", "true");
    }, []);

    return (
        <h1>404 Not Found</h1>
    )
}