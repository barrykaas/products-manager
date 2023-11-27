import { Typography, Box, ListItem, ListItemText, ListItemButton, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import { useBrands } from "../Brands/BrandsApiQueries";
import useHumanReadableProduct from "./HumanReadableProduct";


export function ProductListItem({ product, onSelect, onEdit, disabled = false, showBarcode = false }) {
    const brands = useBrands();
    let brandName;
    const { formatProductDescription } = useHumanReadableProduct();

    if (brands.isLoading) {
        brandName = "Loading brand...";
    } else if (brands.isError) {
        brandName = "ERROR loading brands";
    } else {
        const filteredBrand = brands.data.filter(brandItem => product.brand === brandItem.id);
        brandName = filteredBrand.length > 0 ? filteredBrand[0].name : null;
    }

    const quantityString = formatProductDescription(product);

    return <DrawProductListItem
        name={product.name}
        brand={brandName}
        unitPrice={product.unit_price}
        quantity={quantityString}
        barcode={showBarcode ? product.barcode : null}
        onSelect={onSelect}
        onEdit={onEdit}
        disabled={disabled}
    />;
}


export function DrawProductListItem({ name, brand, unitPrice, quantity, barcode, onSelect, onEdit, disabled = false }) {

    let primary = name;
    if (barcode) {
        primary = <>
            <Box sx={{ display: 'inline' }}>{name}</Box>
            <Box sx={{ display: 'inline', fontFamily: 'Monospace' }}> ({barcode})</Box>
        </>;
    }

    const editButton = onEdit ?
        <IconButton aria-label="comment" onClick={onEdit}>
            <EditIcon />
        </IconButton>
        : null;

    return (
        <ListItem alignItems="flex-start" disablePadding secondaryAction={editButton}>
            <ListItemButton onClick={onSelect} disabled={disabled}>
                <ListItemText
                    primary={primary}
                    secondary={
                        <>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                {brand ? brand : 'merkloos'}

                            </Typography>
                            {unitPrice ? ` - €${unitPrice.toFixed(2)} - ` : " - "}
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                {quantity}

                            </Typography>
                        </>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
}

