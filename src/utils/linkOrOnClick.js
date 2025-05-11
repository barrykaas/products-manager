import { Link } from "react-router";


export function linkOrOnClick(linkOrCallback) {
    if (typeof linkOrCallback === 'string') {
        return {
            component: Link,
            to: linkOrCallback
        }
    } else if (typeof linkOrCallback === 'function') {
        return {
            onClick: linkOrCallback
        }
    } else {
        return { };
    }
}
