import { useState } from "react";
import { Box, Skeleton, Typography, Stack, IconButton, ListItem } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { useListItemDeleter, useListItemMutator } from "../../../Lists/ListsApiQueries";
import { useBrands } from "../../../Brands/BrandsApiQueries";
import ProductTooltip from "../../../Products/ProductTooltip";
import QuantityController from "./QuantityController";
import FormDialog from "../../../Helpers/FormDialog";
import ProductController from "../../../Products/ProductController";


export default function ReceiptProductItem({ item }) {
    const [productPickerOpen, setProductPickerOpen] = useState(false);
    const deleteListItem = useListItemDeleter();
    const mutateListItem = useListItemMutator();
    const product = item.product;

    const onDelete = () => {
        deleteListItem(item.id);
    };

    const handleReplacementProduct = (product) => {
        mutateListItem({
            id: item.id,
            product_id: product.id
        }, { onSuccess: () => setProductPickerOpen(false) });
    };

    return (
        <ListItem disableGutters>
            <Stack spacing={1} width={1}>

                <Stack
                    sx={{ px: 2 }}
                    direction="row" alignItems="center" justifyContent="flex-start"
                    spacing={1}
                >
                    <ProductInfo product={product} />
                    <Box flexGrow={1} />

                    <IconButton onClick={onDelete} color="error">
                        <Delete />
                    </IconButton>
                </Stack>

                <QuantityController listItem={item} />
            </Stack>

            <FormDialog
                open={productPickerOpen}
                hasToolbar={false}
            >
                <ProductController
                    onClose={() => setProductPickerOpen(false)}
                    handleSelectedProduct={handleReplacementProduct}
                />
            </FormDialog>
        </ListItem>
    );
}


function ProductInfo({ product }) {
    const brandsQuery = useBrands();
    const brandName = brandsQuery.getBrand(product.brand)?.name;

    const isLoading = brandsQuery.isLoading;
    const isError = brandsQuery.isError;

    if (isLoading || isError) {
        return <Skeleton />
    }

    return (
        <Stack alignItems="flex-start">
            {brandName &&
                <Typography variant="subtitle2" color="text.secondary">
                    {brandName}
                </Typography>
            }
            <ProductTooltip product={product}>
                <Typography variant="h6">
                    {product.name}
                </Typography>
            </ProductTooltip>
        </Stack>
    );
}
