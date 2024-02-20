import ScannedItemsList from "./ScannedItemsList";
import { useState } from "react";
import { ProductFormDialog } from "../Products/ProductsForm";
import { useScannedItemsInvalidator } from "./ScannedItemsApiQueries";
import ControllerView from "../Helpers/ControllerView";


export default function ScannedItemsController({ onClose, title = "Gescand", selectBarcode, disableKnownProducts = false }) {
    const [editingProduct, setEditingProduct] = useState();
    const invalidateScannedItems = useScannedItemsInvalidator();
    const customSelectHandler = Boolean(selectBarcode);

    if (!customSelectHandler) {
        selectBarcode = (barcodeItem) => {
            if (barcodeItem.product) {
                setEditingProduct(barcodeItem.product);
            } else {
                setEditingProduct({
                    barcode: barcodeItem.barcode
                });
            }
        };
    }

    const onRefresh = invalidateScannedItems;

    return (
        <>
            <ControllerView title={title} onClose={onClose} onRefresh={onRefresh}>
                <ScannedItemsList selectBarcode={selectBarcode} disableKnownProducts={disableKnownProducts} />
            </ControllerView>

            {!customSelectHandler && (
                <ProductFormDialog
                    initialValues={editingProduct}
                    onSuccessfulCreateEdit={() => setEditingProduct(null)}
                    open={Boolean(editingProduct)}
                    onClose={() => setEditingProduct(null)}
                />
            )}
        </>
    );
}
