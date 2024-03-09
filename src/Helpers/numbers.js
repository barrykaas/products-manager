export function isNumber(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}

export function roundDigits(number, digits) {
    return Number(number.toFixed(digits));
}
