import { createContext, useState } from "react";


export const SearchParamsContext = createContext({
    searchParams: new URLSearchParams(),
    setSearchParams: () => { }
});

export function SearchParamsProvider({ initialSearchParams, children }) {
    const [searchParams, setSearchParamsState] = useState(new URLSearchParams(initialSearchParams));
    const setSearchParams = (newParams) => setSearchParamsState(new URLSearchParams([...newParams.entries()]));

    return (
        <SearchParamsContext.Provider value={{ searchParams, setSearchParams }}>
            {children}
        </SearchParamsContext.Provider>
    );
}
