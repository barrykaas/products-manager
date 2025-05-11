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
        // Keep short date
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

export function isoToRelativeDateTime(isoString) {
    const timeStr = (new Date(isoString)).toLocaleTimeString(
        locale,
        { hour: '2-digit', minute: '2-digit' }
    );
    return isoToRelativeDate(isoString) + ', ' + timeStr;
}

export function startOfWeek(date) {
    const startOfWeek = date ? new Date(date) : new Date();
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() + 6) % 7);
    // startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
}

export function endOfWeek(date) {
    const endOfWeek = date ? new Date(date) : new Date();
    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()) % 7);
    // const newDate = new Date(endOfWeek.);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
}

export function localStartOfWeek(date) {
    const start = startOfWeek(date);
    start.setHours(0, 0, 0, 0);
    return start;
}

export const toISODateString = (date) => date.toISOString().split('T')[0];
export const toLocalISODateString = (date) =>
    date.getFullYear() + '-'
    + String(date.getMonth() + 1).padStart(2, '0') + '-'
    + String(date.getDate()).padStart(2, '0');

export const advanceDays = (date, days) => date.setDate(date.getDate() + days);
