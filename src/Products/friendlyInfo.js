import { formatEuro } from "../Helpers/monetary";


export function formatUnitPrice(product) {
    const unit = product.volume ? product.unit_type.physical_unit : 'st.';
    return `p. ${unit} ` + formatEuro(product.unit_price);
}

export function formatProductQuantity(quantity, unit) {
    quantity = Number(quantity);
    if (unit === null) return quantity + 'x';

    if (Math.floor(quantity * 10) !== quantity * 10) { // not x.y00
        quantity *= 1000;
        if (unit === 'L') {
            unit = 'mL';
        } else if (unit === 'kg') {
            unit = 'g'
        }
    }

    return `${quantity} ${unit}`;
}
