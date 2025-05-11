export function searchParamsToObject(searchParams) {
    const o = {};
    searchParams.forEach((value, param) => {
        o[param] = value;
    });
    return o;
}

export function searchQueryToSearchParams(search, searchParams, setSearchParams) {
    if (search) {
        searchParams.set('search', search);
    } else {
        searchParams.delete('search');
    }
    setSearchParams(searchParams, { replace: true });
}
