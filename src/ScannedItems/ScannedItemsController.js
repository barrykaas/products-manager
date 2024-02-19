import { Box } from "@mui/material";

import ScannedItemsList from "./ScannedItemsList";
import { useState } from "react";
import { ProductFormDialog } from "../Products/ProductsForm";
import { useScannedItemsInvalidator } from "./ScannedItemsApiQueries";
import ControllerAppBar from "../Helpers/ControllerAppBar";


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
            <Box sx={{ height: '100%' }}>
                <ControllerAppBar title={title} onClose={onClose} onRefresh={onRefresh} />
                <Box sx={{ height: '100%', overflow: "scroll" }}>
                    <ScannedItemsList selectBarcode={selectBarcode} disableKnownProducts={disableKnownProducts} />
                </Box>
            </Box>

            {
                customSelectHandler ? null : (
                    <ProductFormDialog
                        initialValues={editingProduct}
                        onSuccessfulCreateEdit={() => setEditingProduct(null)}
                        open={Boolean(editingProduct)}
                        onClose={() => setEditingProduct(null)}
                    />
                )
            }
        </>
    );
}
