import { Typography, ListItem, ListItemText, ListItemButton, IconButton, Stack } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import { useBrands } from "../Brands/BrandsApiQueries";
import useHumanReadableProduct from "./HumanReadableProduct";
import { formatEuro } from "../Helpers/monetary";
import useUnitTypeInfo from "../UnitTypes/UnitTypeInfo";
import { formatPricePerUnit } from "../Helpers/productQuantity";


export function ProductListItem({ product, onSelect, onEdit, disabled = false, showBarcode = false }) {
    const brands = useBrands();
    let brandName;
    const { formatProductDescription } = useHumanReadableProduct();
    const { unitTypeInfo } = useUnitTypeInfo();

    if (brands.isLoading) {
        brandName = "Merk wordt geladen...";
    } else if (brands.isError) {
        brandName = "ERROR loading brands";
    } else {
        const filteredBrand = brands.data.filter(brandItem => product.brand === brandItem.id);
        brandName = filteredBrand.length > 0 ? filteredBrand[0].name : null;
    }

    const name = product.name;
    const price = product.unit_price;

    const unitType = unitTypeInfo(product.unit_type);
    const pricePerUnitString = unitType ? formatPricePerUnit({
        unit: unitType.physical_unit,
        volumeOrPieces: product.unit_weightvol || product.unit_number,
        price
    }) : null;
    const barcode = product.barcode;

    const secondaryInfo = [
        formatProductDescription(product),
    ];

    const editButton = onEdit ?
        <IconButton aria-label="comment" onClick={onEdit}>
            <EditIcon />
        </IconButton>
        : null;

    return (
        <ListItem alignItems="flex-start" disablePadding
            secondaryAction={editButton}
        >
            <ListItemButton onClick={onSelect} disabled={disabled}>
                <ListItemText
                    sx={onEdit && { pr: 2 }}
                    primary={
                        <Stack>
                            <Typography variant="subtitle2" color="text.secondary">
                                {brandName}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <Typography>{name}</Typography>
                                {showBarcode &&
                                    <Typography
                                        fontFamily="monospace"
                                    >
                                        [{barcode}]
                                    </Typography>
                                }
                                {price !== 0 &&
                                    <Typography align="right"
                                        sx={{ whiteSpace: "nowrap", flexGrow: 1 }}
                                    >
                                        <b>{formatEuro(price)}</b>
                                    </Typography>
                                }
                            </Stack>
                        </Stack>
                    }
                    secondary={
                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                            {secondaryInfo.filter(Boolean).join("  -  ")}
                            {price !== 0 &&
                                <Typography
                                    variant="inherit" align="right"
                                    sx={{ whiteSpace: "nowrap" }}
                                >
                                    {pricePerUnitString}
                                </Typography>
                            }
                        </Stack>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
}
