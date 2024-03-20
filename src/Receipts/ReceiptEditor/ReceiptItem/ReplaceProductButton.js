import { FindReplace } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";

import ProductPicker from "../../../Products/ProductPicker";
import { useListItemMutator } from "../../../Lists/ListsApiQueries";
import { constructListItem, finishListItem } from "./tools";
import useUnitTypeInfo from "../../../UnitTypes/UnitTypeInfo";


export default function ReplaceProductButton({ listItem }) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const { isError, isLoading, unitTypeInfo } = useUnitTypeInfo();
    const updateListItem = useListItemMutator({
        onSuccess: () => setPickerOpen(false)
    });
    const hasProduct = Boolean(listItem?.product);

    const disabled = isLoading || isError;

    const onClick = () => {
        setPickerOpen(true);
    };

    const handleNewProduct = (product) => {
        product.discrete = unitTypeInfo(product.unit_type)?.discrete;
        let itemPatch;
        if (hasProduct) {
            itemPatch = { product_id: product.id };
        } else {
            itemPatch = constructListItem(product);
            itemPatch.amount = listItem.amount;
            if (product.discrete) {
                delete itemPatch.product_price;
            } else {
                delete itemPatch.product_quantity;
            }
            finishListItem(itemPatch);
        }
        updateListItem({
            id: listItem.id,
            ...itemPatch
        });
    };

    const tooltip = hasProduct ? "Kies ander product" : "Koppel een product";

    return (
        <>
            <Tooltip title={tooltip}>
                <IconButton onClick={onClick} disabled={disabled}>
                    <FindReplace />
                </IconButton>
            </Tooltip>

            <ProductPicker
                handleSelectedProduct={handleNewProduct}
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
            />
        </>
    );
}
