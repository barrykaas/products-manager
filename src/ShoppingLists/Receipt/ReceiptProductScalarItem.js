import { Box, Button, Grid, InputAdornment, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useListItemDeleter, useListItemMutator } from "../ShoppingListApiQueries";
import { useBrands } from "../../Brands/BrandsApiQueries";



export default function ReceiptProductScalarItem({ item }) {
    const mutateListItem = useListItemMutator();
    const deleteListItem = useListItemDeleter();

    const product = item.product;

    const brandsQuery = useBrands();
    const brandName = brandsQuery.getBrand(product.brand)?.name;

    const isLoading = brandsQuery.isLoading;
    const isError = brandsQuery.isError;

    if (isLoading || isError) {
        return <Skeleton />
    }

    const increaseQuantity = () => {
        mutateListItem({
            id: item.id,
            product_quantity: item.product_quantity + 1
        })
    }

    const disabledDecrease = (item.product_quantity === 1)
    const decreaseQuantity = () => {
        if ((item.product_quantity - 1) > 0) {
            mutateListItem({
                id: item.id,
                product_quantity: item.product_quantity - 1
            })
        }
    }

    const removeItem = () => {
        deleteListItem(item.id);
    };

    return (

        <Box>
            <Box sx={{ my: 1, mx: 2 }}>
                <Grid container alignItems="center">
                    <Grid item xs={0.5}>
                        <Typography gutterBottom variant="overline" component="div">
                            {item.product_quantity}x
                            {product.unit_type}
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <Typography gutterBottom variant="h6" component="div">
                            {product.name}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant="h6" component="div">
                            €{product.unit_price}
                        </Typography>
                    </Grid>
                </Grid>
                <Typography color="text.secondary" variant="body2">
                    {brandName}
                </Typography>
            </Box>
            <Box sx={{ mt: 1, mb: 2, ml: 2 }}>

                <Stack
                    direction="row"
                    spacing={2}
                >
                    <Button size="small" variant="contained" onClick={() => increaseQuantity()}>+</Button>
                    <Button size="small" variant="contained" disabled={disabledDecrease} onClick={() => decreaseQuantity()}>-</Button>
                    <Button size="small" variant="contained" color="error" onClick={removeItem} >Verwijder</Button>
                    <TextField
                        size="small"
                        label="Korting"
                        startAdornment={<InputAdornment position="start">- €</InputAdornment>}
                    />
                </Stack>


            </Box>
        </Box>
    )
}