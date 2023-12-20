import { Box, Grid, InputAdornment, Skeleton, Stack, TextField, Typography, IconButton } from "@mui/material";
import { AddCircle, Close, Delete, RemoveCircle } from "@mui/icons-material";
import { useState } from "react";

import { useListItemDeleter, useListItemMutator } from "../../Lists/ListsApiQueries";
import { useBrands } from "../../Brands/BrandsApiQueries";
import { formatPrice } from "../../Helpers/monetary";
import ProductTooltip from "../../Products/ProductTooltip";


export default function ReceiptProductDiscreteItem({ item }) {
    const mutateListItem = useListItemMutator();
    const deleteListItem = useListItemDeleter();
    const [quantityField, setQuantityField] = useState(item.product_quantity);
    const [unitPriceField, setUnitPriceField] = useState(formatPrice(item.product_price));
    const [amountField, setAmountField] = useState(
        formatPrice(item.product_quantity * item.product_price)
    );
    const [recentField, setRecentField] = useState("unitPrice");

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
    const increaseQuantity = () => {
        const newQuantity = item.product_quantity + 1;
        setQuantityField(newQuantity);
        let unitPrice = unitPriceField;
        if (recentField === "unitPrice") {
            setAmountField(formatPrice(newQuantity * unitPriceField));
        } else {
            unitPrice = amountField / newQuantity;
            setUnitPriceField(formatPrice(unitPrice));
        }
        mutateListItem({
            id: item.id,
            product_quantity: newQuantity,
            product_price: unitPrice
        });
    }

    const disabledDecrease = (item.product_quantity <= 1)
    const decreaseQuantity = () => {
        const newQuantity = item.product_quantity - 1;
        setQuantityField(newQuantity);
        let unitPrice = unitPriceField;
        if (recentField === "unitPrice") {
            setAmountField(formatPrice(newQuantity * unitPriceField));
        } else {
            unitPrice = amountField / newQuantity;
            setUnitPriceField(formatPrice(unitPrice));
        }
        mutateListItem({
            id: item.id,
            product_quantity: newQuantity,
            product_price: unitPrice
        });
    }

    const onBlurQuantity = (event) => {
        const newQuantity = event.target.value;
        setQuantityField(newQuantity);
        let unitPrice = unitPriceField;
        if (recentField === "unitPrice") {
            setAmountField(formatPrice(newQuantity * unitPriceField));
        } else {
            unitPrice = amountField / newQuantity;
            setUnitPriceField(formatPrice(unitPrice));
        }
        mutateListItem({
            id: item.id,
            product_quantity: newQuantity,
            product_price: unitPrice
        });
    };

    // Unit price handlers
    const onBlurUnitPrice = (event) => {
        setRecentField("unitPrice");
        setUnitPriceField(formatPrice(unitPriceField));
        const newPrice = event.target.value;
        setAmountField(formatPrice(quantityField * newPrice));
        mutateListItem({
            id: item.id,
            product_price: newPrice
        });
    };

    // Amount handlers
    const onBlurAmount = (event) => {
        setRecentField("amount");
        setAmountField(formatPrice(amountField))
        const newAmount = event.target.value;
        const newUnitPrice = newAmount / quantityField;
        setUnitPriceField(formatPrice(newUnitPrice));
        mutateListItem({
            id: item.id,
            product_price: newUnitPrice
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
                            <ProductTooltip product={product}>
                                <Typography display="inline" variant="h6" component="div" >
                                    {product.name}
                                </Typography>
                            </ProductTooltip>
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
                        sx={{ width: '100px' }}
                        label="Aantal"
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            startAdornment:
                                <IconButton
                                    onClick={decreaseQuantity}
                                    disabled={disabledDecrease}
                                >
                                    <RemoveCircle />
                                </IconButton>,
                            endAdornment:
                                <IconButton onClick={increaseQuantity}>
                                    <AddCircle />
                                </IconButton>,
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
                        label="Per stuk"
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
