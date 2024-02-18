export function isoToLocalDate(isoString) {
    if (!isoString) return isoString;
    
    const date = new Date(isoString);
    return date.toLocaleDateString();
}
