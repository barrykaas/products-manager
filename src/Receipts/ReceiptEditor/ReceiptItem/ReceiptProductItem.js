import { useState } from "react";
import { Skeleton, Typography, Stack, IconButton, ListItem } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import { listItemsQueryKey, useListItemDeleter, useListItemMutator } from "../../../Lists/ListsApiQueries";
import { useBrands } from "../../../Brands/BrandsApiQueries";
import ProductTooltip from "../../../Products/ProductTooltip";
import QuantityController from "./QuantityController";
import FormDialog from "../../../Helpers/FormDialog";
import ProductController from "../../../Products/ProductController";
import { ProductFormDialog } from "../../../Products/ProductsForm";
import { useQueryClient } from "@tanstack/react-query";


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
                    direction="row" alignItems="center" justifyContent="space-between"
                    spacing={1}
                >
                    <ProductInfo product={product} />

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
    const [editorOpen, setEditorOpen] = useState(false);
    const queryClient = useQueryClient();
    const invalidateListItems = () => queryClient.invalidateQueries([listItemsQueryKey]);

    const isLoading = brandsQuery.isLoading;
    const isError = brandsQuery.isError;

    if (isLoading || isError) {
        return <Skeleton />
    }

    return (
        <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
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
            <IconButton onClick={() => setEditorOpen(true)}>
                <Edit />
            </IconButton>

            <ProductFormDialog
                initialValues={product}
                open={editorOpen}
                onClose={() => setEditorOpen(false)}
                onSuccessfulCreateEdit={() => {
                    invalidateListItems();
                    setEditorOpen(false);
                }}
            />
        </Stack>
    );
}
