export function getWords(string) {
    return string.split(' ').filter(
        word => word !== ''
    );
}

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
