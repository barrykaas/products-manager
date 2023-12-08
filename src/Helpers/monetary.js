export function formatPrice(price) {
    return `€ ${Math.round(100 * price) / 100}`
}
