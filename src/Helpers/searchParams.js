export function searchParamsToObject(searchParams) {
    const o = {};
    searchParams.forEach((value, param) => {
        o[param] = value;
    });
    return o;
}
