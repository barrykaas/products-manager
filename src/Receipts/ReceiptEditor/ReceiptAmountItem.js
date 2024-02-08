import { Grid, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { useListItemDeleter, useListItemMutator } from "../../Lists/ListsApiQueries";
import { formatPrice } from "../../Helpers/monetary";
import { Delete } from "@mui/icons-material";


export default function ReceiptAmountItem({ item }) {
    const price = item?.amount ?? 0;

    const [amountFieldValue, setAmountFieldValue] = useState(formatPrice(price));
    const mutateListItem = useListItemMutator();
    const deleteListItem = useListItemDeleter();

    const onUpdate = () => {
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

    const onDelete = () => {
        deleteListItem(item.id);
    };


    return (
        <Stack sx={{ my: 1, mx: 2 }}>
            <Grid container alignItems="center">
                <Grid item xs>
                    <Typography variant="h6" component="div">
                        Los bedrag
                    </Typography>
                </Grid>

                <Grid item>
                    <TextField
                        sx={{ m: 1, width: '10ch' }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        }}
                        variant="standard"
                        value={amountFieldValue}
                        onChange={(event) => setAmountFieldValue(event.target.value)}
                        onBlur={onUpdate}
                        onFocus={(event) => event.target.select()}
                    />
                </Grid>

                <Grid item>
                    <IconButton onClick={onDelete} color="error">
                        <Delete />
                    </IconButton>
                </Grid>
            </Grid>
        </Stack>
    );
}
