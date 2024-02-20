
const locale = 'nl-NL'

const shortDate = d => d.toLocaleDateString(
    locale, { weekday: 'short', day: 'numeric', month: 'short' }
);

export function isoToLocalDate(isoString) {
    if (!isoString) return isoString;

    const date = new Date(isoString);
    return date.toLocaleDateString();
}

export function isoToRelativeDate(isoString) {
    if (!isoString) return isoString;

    const date = new Date(isoString); date.setHours(0, 0, 0, 0);
    const today = new Date();
    const daysAgo = (today - date) / (1000 * 86400);

    if (daysAgo < -2 || daysAgo >= 3) {
        if (today.getFullYear() === date.getFullYear()) {
            return shortDate(date);
        } else {
            return shortDate(date) + ' ' + date.getFullYear();
        }
    } else if (daysAgo < -1) {
        return 'Overmorgen';
    } else if (daysAgo < 0) {
        return 'Morgen';
    } else if (daysAgo < 1) {
        return 'Vandaag';
    } else if (daysAgo < 2) {
        return 'Gisteren';
    } else if (daysAgo < 3) {
        return 'Eergisteren';
    } else {
        return isoString;
    }
}
