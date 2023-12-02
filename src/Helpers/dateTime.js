export function isoToLocalDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString();
}
