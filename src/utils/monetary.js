export function formatPrice(price) {
    if (!price && price !== 0) {
        return '?';
    }
    price = Number(price);
    const digits = (price % 1 === 0) ? 0 : 2;
    return `${price.toFixed(digits)}`;
}

export function formatEuro(price) {
    return '€ ' + formatPrice(price);
}
