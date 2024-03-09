import { isNumber } from "../../../Helpers/numbers";

/**
 * Construct a list item with default quantity and price from a product.
 * @param {object} product
 */
export function constructListItem(product) {
    const listItem = { product_id: product.id, product: {...product} };
    if (product.discrete) {
        listItem.product_quantity = 1;
        listItem.product_price = product.unit_price;
        listItem.amount = product.unit_price;
    } else {
        listItem.product_quantity = product.unit_weightvol;
        listItem.product_price = product.unit_price / product.unit_weightvol;
        listItem.amount = product.unit_price;
    }
    return listItem;
}

/**
 * Finish the equation `amount = quantity * price` on the list item.
 * @param {object} listItem 
 */
export function finishListItem(listItem) {
    const {
        product_quantity,
        product_price,
        amount,
    } = listItem;

    if (isNumber(amount)) {
        if (isNumber(product_quantity)) {
            listItem.product_price = amount / product_quantity;
        } else if (isNumber(product_price)) {
            listItem.product_quantity = amount / product_price;
        }
    } else {
        listItem.amount = product_quantity * product_price;
    }
    listItem.product_quantity = Math.round(listItem.product_quantity);
}
