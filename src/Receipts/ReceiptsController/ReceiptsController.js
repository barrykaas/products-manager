import ReceiptsAppBar from "./ReceiptsAppBar";
import ReceiptsList from "./ReceiptsList/ReceiptsList";


export default function ReceiptsController({ onAddReceipt }) {
    return (
        <>
            <ReceiptsAppBar handleAddButton={onAddReceipt} />

            <ReceiptsList />
        </>
    );
}
