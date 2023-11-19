import { Typography, Box, ListItem, ListItemText, ListItemButton, CircularProgress, Skeleton } from "@mui/material";
import { useBrands } from "./Brands";
import useHumanReadableProduct from "../Products/HumanReadableProduct";


export function ProductListItem({ product, handleSelection, available = true }) {
    const brands = useBrands();
    let brandName;
    const { formatProductDescription } = useHumanReadableProduct();

    if (brands.isLoading || brands.isError) {
        brandName = "Loading brand...";
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
        handleSelection={handleSelection}
        available={available}
    />;
}

export function DrawProductListItem({ name, brand, unitPrice, quantity, barcode, handleSelection, available = true }) {

    let primary = name;
    if (barcode) {
        primary = <>
            <Box sx={{ display: 'inline' }}>{name}</Box>
            <Box sx={{ display: 'inline', fontFamily: 'Monospace' }}> ({barcode})</Box>
        </>;
    }

    return (
        <ListItem alignItems="flex-start" disablePadding>
            <ListItemButton onClick={handleSelection} disabled={!available}>
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

