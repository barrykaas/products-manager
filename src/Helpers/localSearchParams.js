import { useState } from "react";
import { useSearchParams } from "react-router-dom";


export default function useLocalSearchParams(local = true) {
    const globalSet = useSearchParams();
    const localSet = useState(new URLSearchParams());

    return local ? localSet : globalSet;
}
