import ReceiptAmountItem from "./ReceiptAmountItem";
import ReceiptProductItem from "./ReceiptProductItem";


export default function ReceiptItem({ item }) {
    if (item.product) {
        return <ReceiptProductItem item={item} />;
    } else {
        return <ReceiptAmountItem item={item} />;
    }
}
