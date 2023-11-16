import { Typography, Grid, Box, ListItem, ListItemText, ListItemButton, Skeleton, CircularProgress } from "@mui/material";
import { useBrands } from "./Brands";
import useHumanReadableProduct from "../Products/HumanReadableProduct";


export function ProductListItem({ product, handleSelection }) {
    const brands = useBrands();
    let brandName;
    const {isLoadingHuman, isErrorHuman, formatProductDescription, errorHuman} = useHumanReadableProduct();
    
    if (brands.isLoading || brands.isError) {
        brandName = <CircularProgress />;
    } else {
        const filteredBrand = brands.data.data.filter(brandItem => product.brand === brandItem.id);
        brandName = filteredBrand.length > 0 ? filteredBrand[0].name : null;
    }

    const quantityString = formatProductDescription(product);

    return <DrawProductListItem
        name={product.name}
        brand={brandName}
        unitPrice={product.unit_price}
        quantity={quantityString}
        barcode={product.barcode}
    />;
}

export function DrawProductListItem({ name, brand, unitPrice, quantity, barcode, handleSelection }) {

    let primary = name;
    if (barcode) {
        primary = <>
            <Box sx={{ display: 'inline' }}>{name}</Box>
            <Box sx={{ display: 'inline', fontFamily: 'Monospace' }}> ({barcode})</Box>
        </>;
    }

    return (
        <ListItem alignItems="flex-start" disablePadding>
            <ListItemButton onClick={handleSelection}>
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

