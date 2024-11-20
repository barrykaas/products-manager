export function isNumber(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}

export function roundDigits(number, digits) {
    return Number(Number(number).toFixed(digits));
}

export function isInteger(value) {
    return Math.round(value) === Number(value);
}
