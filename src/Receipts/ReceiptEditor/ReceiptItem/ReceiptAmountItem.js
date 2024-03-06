import { IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { useState } from "react";

import { useListItemDeleter, useListItemMutator } from "../../../Lists/ListsApiQueries";
import { formatPrice } from "../../../Helpers/monetary";
import { Delete } from "@mui/icons-material";


export default function ReceiptAmountItem({ item }) {
    const price = item?.amount ?? 0;

    const [amountFieldValue, setAmountFieldValue] = useState(formatPrice(price));
    const [descriptionField, setDescriptionField] = useState(item.description || '');
    const mutateListItem = useListItemMutator();
    const deleteListItem = useListItemDeleter();

    const onUpdateAmount = () => {
        const roundedAmount = formatPrice(amountFieldValue);
        setAmountFieldValue(roundedAmount);
        const newItem = {
            id: item.id,
            product_quantity: null,
            discount: null,
            product_price: roundedAmount,
        };
        mutateListItem(newItem);
    };

    const onUpdateDescription = () => {
        mutateListItem({
            id: item.id,
            description: descriptionField
        })
    };

    const onDelete = () => {
        deleteListItem(item.id);
    };


    return (
        <Stack direction="row" sx={{ my: 1, mx: 2 }}>
            <TextField
                sx={{ m: 1, flexGrow: 1 }}
                variant="standard"
                value={descriptionField}
                onChange={(event) => setDescriptionField(event.target.value)}
                onBlur={onUpdateDescription}
                placeholder="Beschrijving"
            />

            <TextField
                sx={{ m: 1, width: '10ch' }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
                variant="standard"
                value={amountFieldValue}
                onChange={(event) => setAmountFieldValue(event.target.value)}
                onBlur={onUpdateAmount}
                onFocus={(event) => event.target.select()}
            />

            <IconButton onClick={onDelete} color="error">
                <Delete />
            </IconButton>
        </Stack>
    );
}
