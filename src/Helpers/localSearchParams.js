import { useState } from "react";
import { useSearchParams } from "react-router-dom";


export default function useLocalSearchParams(local = true) {
    const globalSet = useSearchParams();
    const [localParams, setLocalParams] = useState(new URLSearchParams());

    if (local) {
        return [localParams, (params) => setLocalParams(
            new URLSearchParams([...params.entries()])
        )];
    } else {
        return globalSet;
    }
}
