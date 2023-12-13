export function formatPrice(price) {
    if (!price) {
        return '€ ?';
    }
    const digits = (price % 1 == 0) ? 0 : 2;
    return `€ ${price.toFixed(digits)}`;
}
