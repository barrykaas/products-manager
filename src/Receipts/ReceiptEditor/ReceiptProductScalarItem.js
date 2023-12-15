import { Box, Grid, InputAdornment, Skeleton, Stack, TextField, Typography, IconButton } from "@mui/material";
import { Close, Delete } from "@mui/icons-material";
import { useState } from "react";

import { useListItemDeleter, useListItemMutator } from "../../Lists/ListsApiQueries";
import { useBrands } from "../../Brands/BrandsApiQueries";
import { formatPrice } from "../../Helpers/monetary";
import { moveToFront } from "../../Helpers/arrays";


function formatWeight(weight) {
    return Number(weight).toFixed(3);
}

export default function ReceiptProductScalarItem({ item }) {
    const mutateListItem = useListItemMutator();
    const deleteListItem = useListItemDeleter();
    const [quantityField, setQuantityField] = useState(formatWeight(item.product_quantity));
    const [unitPriceField, setUnitPriceField] = useState(formatPrice(item.product_price));
    const [amountField, setAmountField] = useState(
        formatPrice(item.product_quantity * item.product_price)
    );
    const [recentFields, setRecentFields] = useState(["unitPrice", "quantity", "amount"]);
    const setMostRecent = (field) => {
        const newOrder = moveToFront(recentFields, field);
        setRecentFields(newOrder);
        console.log(field, newOrder, newOrder[newOrder.length - 1]);
        // return newOrder, newOrder[length(newOrder) - 1];
        // return newOrder;
        return newOrder[newOrder.length - 1];
    };

    const product = item.product;

    const brandsQuery = useBrands();
    const brandName = brandsQuery.getBrand(product.brand)?.name;

    const isLoading = brandsQuery.isLoading;
    const isError = brandsQuery.isError;

    if (isLoading || isError) {
        return <Skeleton />
    }

    const onDelete = () => {
        deleteListItem(item.id);
    };

    // Quantity handlers
    const onBlurQuantity = (event) => {
        const oldestField = setMostRecent("quantity");
        const newQuantity = Number(event.target.value);
        setQuantityField(newQuantity.toFixed(3));
        let unitPrice = unitPriceField;
        if (oldestField === "unitPrice") {
            unitPrice = amountField / newQuantity;
            setUnitPriceField(formatPrice(unitPrice));
        } else { // amount
            setAmountField(formatPrice(newQuantity * unitPriceField));
        }
        mutateListItem({
            id: item.id,
            product_quantity: newQuantity,
            product_price: unitPrice
        });
    };

    // Unit price handlers
    const onBlurUnitPrice = (event) => {
        const oldestField = setMostRecent("unitPrice");
        const newUnitPrice = event.target.value;
        setUnitPriceField(formatPrice(newUnitPrice));
        let quantity = quantityField;
        if (oldestField === "quantity") {
            quantity = amountField / newUnitPrice;
            setQuantityField(quantity);
        } else { // amount
            setAmountField(formatPrice(quantity * newUnitPrice));
        }
        mutateListItem({
            id: item.id,
            product_quantity: quantity,
            product_price: newUnitPrice
        });
    };

    // Amount handlers
    const onBlurAmount = (event) => {
        const oldestField = setMostRecent("amount");
        const newAmount = event.target.value;
        setAmountField(formatPrice(newAmount));
        let quantity = quantityField;
        let unitPrice = unitPriceField
        if (oldestField === "quantity") {
            quantity = newAmount / unitPrice;
            setQuantityField(quantity);
        } else { // unitPrice
            unitPrice = newAmount / quantity;
            setUnitPriceField(formatPrice(unitPrice));
        }
        mutateListItem({
            id: item.id,
            product_quantity: quantity,
            product_price: unitPrice
        });
    };


    return (
        <Box>
            <Stack sx={{ py: 1 }} spacing={1}>
                <Stack
                    sx={{ px: 2 }}
                    direction="row" alignItems="center" justifyContent="space-between"
                >
                    <Grid container alignItems="baseline" spacing={1}>
                        <Grid item>
                            <Typography display="inline" variant="h6" component="div" noWrap>
                                {product.name}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography display="inline" color="text.secondary" variant="body2">
                                {brandName}
                            </Typography>
                        </Grid>
                    </Grid>

                    <IconButton onClick={onDelete} color="error">
                        <Delete />
                    </IconButton>
                </Stack>

                <Stack
                    sx={{ pl: 2, pr: 0 }}
                    direction="row" alignItems="center" justifyContent="space-between"
                >
                    <TextField
                        value={quantityField}
                        onChange={(e) => setQuantityField(e.target.value)}
                        onBlur={onBlurQuantity}
                        onFocus={(event) => event.target.select()}
                        sx={{ width: '80px' }}
                        label="Gewicht"
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                            disableUnderline: true
                        }}
                    />

                    <Close />

                    <TextField
                        value={unitPriceField}
                        onChange={(e) => setUnitPriceField(e.target.value)}
                        onBlur={onBlurUnitPrice}
                        onFocus={(event) => event.target.select()}
                        sx={{ width: '60px' }}
                        label="Per kg"
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: <InputAdornment position="start">€</InputAdornment>
                        }}
                    />

                    <Typography variant="h4">=</Typography>

                    <TextField
                        value={amountField}
                        onChange={(e) => setAmountField(e.target.value)}
                        onBlur={onBlurAmount}
                        onFocus={(event) => event.target.select()}
                        sx={{ width: '80px' }}
                        label="Bedrag"
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: <InputAdornment position="start">€</InputAdornment>
                        }}
                    />
                </Stack>
            </Stack>
        </Box>
    )
}
