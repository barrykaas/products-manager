import { Box, Button, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { useListItemDeleter, useListItemMutator } from "../../Lists/ListsApiQueries";
import { useState } from "react";


export default function ReceiptDiscountItem({ item }) {
    const discount = item.discount;
    const [discountFieldValue, setDiscountFieldValue] = useState(discount);
    const mutateListItem = useListItemMutator();
    const deleteListItem = useListItemDeleter();

    const onUpdate = () => {
        const newItem = {
            id: item.id,
            discount: discountFieldValue
        };
        mutateListItem(newItem);
    };

    const onClickDelete = () => {
        deleteListItem(item.id);
    };


    return (
        <Box>

            <Box sx={{ my: 1, mx: 2 }}>
                <Grid container alignItems="center">
                    <Grid item xs>
                        <Typography gutterBottom variant="h6" component="div">
                            Korting
                        </Typography>
                    </Grid>

                    <Grid item>
                        <TextField
                            sx={{ m: 1, width: '10ch' }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">- €</InputAdornment>,
                            }}
                            variant="standard"
                            value={discountFieldValue}
                            onChange={(event) => setDiscountFieldValue(event.target.value)}
                            onBlur={onUpdate}
                        />
                    </Grid>

                    <Grid>
                        <Button color="error" onClick={onClickDelete} >Verwijder</Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}