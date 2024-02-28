
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

    let relDate = shortDate(date);

    const fullYear = date.getFullYear();
    if (today.getFullYear() !== fullYear) {
        relDate = relDate + ' ' + fullYear;
    }

    if (daysAgo < -2) {
    } else if (daysAgo < -1) {
        relDate = 'Overmorgen, ' + relDate;
    } else if (daysAgo < 0) {
        relDate = 'Morgen, ' + relDate;
    } else if (daysAgo < 1) {
        relDate = 'Vandaag, ' + relDate;
    } else if (daysAgo < 2) {
        relDate = 'Gisteren, ' + relDate;
    } else if (daysAgo < 3) {
        relDate = 'Eergisteren, ' + relDate;
    }

    return relDate;
}
