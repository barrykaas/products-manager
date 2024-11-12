import { useProduct } from "../Products/api";
import { formatProductQuantity } from "../Helpers/productQuantity";


export function useFormatListItemQuantity(listItem) {
    const product = useProduct(listItem.product)?.data;
    const unit = product?.unit_type?.physical_unit;
    const discrete = product?.unit_type?.discrete;

    if (product && !discrete) {
        return formatProductQuantity({ unit, volume: Number(listItem.quantity) });
    } else {
        return `${Number(listItem.quantity)}`;
    }
}
