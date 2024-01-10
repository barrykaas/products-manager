import { Typography, Box, AppBar, Toolbar, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import ScannedItemsList from "./ScannedItemsList";
import { useState } from "react";
import { ProductFormDialog } from "../Products/ProductsForm";
import { Refresh } from "@mui/icons-material";
import { useScannedItemsInvalidator } from "./ScannedItemsApiQueries";


export default function ScannedItemsController({ onClose, selectBarcode, disableKnownProducts = false }) {
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
                <AppBar position="sticky">
                    <Toolbar>
                        {onClose
                            ? (<IconButton
                                edge="start"
                                color="inherit"
                                onClick={onClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>)
                            : null}
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Gescand
                        </Typography>
                        <IconButton onClick={onRefresh}>
                            <Refresh />
                        </IconButton>
                    </Toolbar>
                </AppBar>
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
