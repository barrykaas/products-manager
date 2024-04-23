import { useSearchParams } from "react-router-dom";


const searchParamName = "search";

export default function useUrlSearchQuery() {
    const [searchParams, setSearchParams] = useSearchParams();

    const searchQuery = searchParams.get(searchParamName) || "";
    const setSearchQuery = (newQuery) => {
        if (newQuery) {
            searchParams.set(searchParamName, newQuery);
        } else {
            searchParams.delete(searchParamName);
        }
        setSearchParams(searchParams, { replace: true });
    };

    return [searchQuery, setSearchQuery];
}
