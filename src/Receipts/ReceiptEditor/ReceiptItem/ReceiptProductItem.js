
import { Box, Skeleton, Typography, Stack, Grid, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { useListItemDeleter } from "../../../Lists/ListsApiQueries";
import { useBrands } from "../../../Brands/BrandsApiQueries";
import ProductTooltip from "../../../Products/ProductTooltip";
import QuantityController from "./QuantityController";


export default function ReceiptProductItem({ item }) {
    const deleteListItem = useListItemDeleter();
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

                <QuantityController listItem={item} />
            </Stack>
        </Box>
    );
}
