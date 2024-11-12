import { useState } from "react";
import { useSearchParams } from "react-router-dom";


export default function useLocalSearchParams(local = true, initialParams) {
    const globalSet = useSearchParams(initialParams);
    const [localParams, setLocalParams] = useState(new URLSearchParams(initialParams));

    if (local) {
        return [localParams, (params) => setLocalParams(
            new URLSearchParams([...params.entries()])
        )];
    } else {
        return globalSet;
    }
}
