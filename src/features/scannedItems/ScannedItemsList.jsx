import { Fragment } from "react";
import { List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";

import { ProductsListItem, useProduct } from "src/features/products";


export function ScannedItemsList({
    items = [],
    getListItemProps = () => ({}),
    onClickProduct,
    onClickBarcode,
    ...props
}) {
    return (
        <List
            sx={{ width: 1 }}
            {...props}
        >
            {items.map((item) =>
                <Fragment key={item.id}>
                    <ScannedItemsListItem
                        item={item}
                        onClickProduct={onClickProduct}
                        onClickBarcode={onClickBarcode}
                        {...getListItemProps(item)}
                    />
                </Fragment>
            )}
        </List>
    );
}

function ScannedItemsListItem({
    item,
    onClickProduct,
    onClickBarcode
}) {
    const productId = item.product?.id;
    const productQuery = useProduct(productId);
    const product = productQuery.data;

    if (!productId || productQuery.isLoading) {
        return (
            <BarcodeListItem barcode={item.barcode} onSelect={() => onClickBarcode(item.barcode)} />
        );
    }

    return (
        <ProductsListItem product={product} showBarcode onClick={() => onClickProduct(product)} />
    );
}

function BarcodeListItem({ barcode, secondary, onSelect }) {
    return (
        <ListItem alignItems="flex-start" disablePadding divider>
            <ListItemButton onClick={onSelect}>
                <ListItemText
                    primary={
                        <Typography fontFamily='monospace'>{barcode}</Typography>
                    }
                    secondary={secondary}
                />
            </ListItemButton>
        </ListItem>
    );
}
