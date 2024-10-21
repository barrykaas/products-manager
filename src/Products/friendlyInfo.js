import { formatEuro } from "../Helpers/monetary";

export function formatUnitPrice(product) {
    const unit = product.volume ? product.unit_type.physical_unit : 'st.';
    return `p. ${unit} ` + formatEuro(product.unit_price);
}
