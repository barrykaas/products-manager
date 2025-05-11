import { useContext } from "react";
import { SearchParamsContext } from "../context/searchParams";


export default function useSearchParams() {
    const { searchParams, setSearchParams } = useContext(SearchParamsContext);
    return [searchParams, setSearchParams];
}

const searchParameter = 'search';
export function useSearchParamsSearch(replace = true) {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get(searchParameter) || '';
    const setSearch = (newSearch) => {
        if (newSearch) {
            searchParams.set(searchParameter, newSearch);
        } else {
            searchParams.delete(searchParameter);
        }
        setSearchParams(searchParams, { replace });
    }

    return [search, setSearch];
}

export function useUrlParamState(parameter, defaultValue, ...defaultArgs) {
    const [searchParams, setSearchParams] = useSearchParams();

    const state = searchParams.get(parameter) || defaultValue;
    const setState = (value, ...args) => {
        searchParams.set(parameter, value);
        setSearchParams(searchParams, ...(args.length > 0 ? args : defaultArgs));
    }

    return [state, setState];
}
