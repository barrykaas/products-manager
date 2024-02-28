
const locale = 'nl-NL'

/**
 * @param {Date} date 
 * @returns {Number}
 */
export function daysAhead(date) {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (date - today) / 86400000;
}

function getDay(date) { // Monday = 0
    return (date.getDay() + 6) % 7;
}

/**
 * @param {Date} date 
 * @returns {Number}
 */
export function weeksAhead(date) {
    date = new Date(date);
    date.setDate(date.getDate() - getDay(date));
    date.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setDate(today.getDate() - getDay(today));
    today.setHours(0, 0, 0, 0);
    return (date - today) / 604800000;
}


const shortDate = d => (new Date(d)).toLocaleDateString(
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
    const daysAgo = -daysAhead(isoString);

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
