import { Box, InputAdornment, Skeleton, Stack, TextField, Typography, IconButton } from "@mui/material";
import { AddCircle, Close, Delete, RemoveCircle } from "@mui/icons-material";

import { useListItemDeleter, useListItemMutator } from "../../Lists/ListsApiQueries";
import { useBrands } from "../../Brands/BrandsApiQueries";
import { formatPrice } from "../../Helpers/monetary";
import { useState } from "react";


export default function ReceiptProductDiscreteItem({ item }) {
    const mutateListItem = useListItemMutator();
    const deleteListItem = useListItemDeleter();
    const [quantityField, setQuantityField] = useState(item.product_quantity);
    const [unitPriceField, setUnitPriceField] = useState(item.product_price);

    const product = item.product;

    const brandsQuery = useBrands();
    const brandName = brandsQuery.getBrand(product.brand)?.name;

    const isLoading = brandsQuery.isLoading;
    const isError = brandsQuery.isError;

    if (isLoading || isError) {
        return <Skeleton />
    }

    // Quantity handlers
    const increaseQuantity = () => {
        const newQ = item.product_quantity + 1;
        setQuantityField(newQ);
        mutateListItem({
            id: item.id,
            product_quantity: newQ
        });
    }

    const disabledDecrease = (item.product_quantity <= 1)
    const decreaseQuantity = () => {
        const newQ = item.product_quantity - 1;
        setQuantityField(newQ);
        mutateListItem({
            id: item.id,
            product_quantity: newQ
        });
    }

    const onBlurQuantity = (event) => {
        const newQuantity = event.target.value;
        // setQuantityField(newQuantity);
        // console.log(newQuantity, event);
        mutateListItem({
            id: item.id,
            product_quantity: newQuantity
        });
    };

    // Unit price handlers
    const onBlurUnitPrice = (event) => {
        const newPrice = event.target.value;
        mutateListItem({
            id: item.id,
            product_price: newPrice
        });
    };

    const onDelete = () => {
        deleteListItem(item.id);
    };

    const amount = item.product_quantity * item.product_price;

    return (
        <>
            <Box>
                <Stack
                    sx={{ px: 2, py: 1 }}
                    direction="row" alignItems="center" justifyContent="space-between"
                >
                    <Stack>
                        <Box>
                            <Typography gutterBottom display="inline" variant="h6" component="div">
                                {product.name}
                            </Typography>
                            <Typography display="inline" color="text.secondary" variant="body2">
                                {brandName}
                            </Typography>
                        </Box>

                        <Stack spacing={1} direction="row" alignItems="center">
                            <IconButton onClick={onDelete}>
                                <Delete />
                            </IconButton>

                            <TextField
                                value={quantityField}
                                onChange={(e) => setQuantityField(e.target.value)}
                                onBlur={onBlurQuantity}
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
                                sx={{ width: '100px' }}
                                label="Prijs p. st. / kg"
                                variant="standard"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    disableUnderline: true,
                                    startAdornment: <InputAdornment position="start">€</InputAdornment>
                                }}
                            />
                        </Stack>
                    </Stack>

                    <Typography
                        sx={{ "white-space": "nowrap" }}
                        gutterBottom variant="h6" component="div"
                    >
                        {formatPrice(amount)}
                    </Typography>
                </Stack>
            </Box>
        </>
    )
}
