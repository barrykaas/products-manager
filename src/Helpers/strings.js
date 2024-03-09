export function getWords(string) {
    return string.split(' ').filter(
        word => word !== ''
    );
}
