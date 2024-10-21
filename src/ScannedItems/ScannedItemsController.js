import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import ScannedItemsList from "./ScannedItemsList";
import { ProductFormDialog } from "../Products/ProductsForm";
import ControllerView from "../Helpers/ControllerView";
import { apiLocations } from "../Api/Common";


export default function ScannedItemsController({ onClose, title = "Gescand", selectBarcode, disableKnownProducts = false }) {
    const [editingProduct, setEditingProduct] = useState();
    const customSelectHandler = Boolean(selectBarcode);
    const queryClient = useQueryClient();

    if (!customSelectHandler) {
        selectBarcode = (barcodeItem) => {
            if (barcodeItem.product) {
                const product = queryClient.getQueryData([apiLocations.products, barcodeItem.product]);
                setEditingProduct(product);
            } else {
                setEditingProduct({
                    barcode: barcodeItem.barcode
                });
            }
        };
    }

    const onRefresh = () => queryClient.invalidateQueries([apiLocations.scannedItems]);

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
