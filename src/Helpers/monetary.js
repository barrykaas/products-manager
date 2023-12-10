export function formatPrice(price) {
    const digits = (price % 1 == 0) ? 0 : 2;
    return `€ ${price.toFixed(digits)}`;
}
