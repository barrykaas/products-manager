import { Typography, ListItem, ListItemText, ListItemButton, IconButton, Stack } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import { formatEuro } from "../Helpers/monetary";
import { productQuantityDescription } from "../Helpers/productQuantity";
import { useSettings } from "../Settings/settings";
import IdLabel from "../Common/IdLabel";
import BrandLabel from "../Brands/BrandLabel";
import { formatUnitPrice } from "./friendlyInfo";


export function ProductListItem({ product, onSelect, onEdit, disabled = false, showBarcode = false }) {
    const [{ nerdInfo }] = useSettings();

    const name = product.name;
    const price = product.price;

    const pricePerUnitString = formatUnitPrice(product);
    const barcode = product.barcode;

    const secondaryInfo = [
        productQuantityDescription(product),
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
            <ListItemButton onClick={() => onSelect(product)} disabled={disabled}>
                <ListItemText
                    sx={onEdit && { pr: 2 }}
                    primary={
                        <Stack>
                            <BrandLabel
                                brandId={product?.brand}
                                variant="subtitle2"
                                color="text.secondary"
                            />
                            <Stack direction="row" spacing={1}>
                                {nerdInfo && <IdLabel id={product.id} />}
                                <Typography>{name}</Typography>
                                {price !== 0 &&
                                    <Typography align="right"
                                        sx={{ whiteSpace: "nowrap", flexGrow: 1 }}
                                    >
                                        <b>{formatEuro(price)}</b>
                                    </Typography>
                                }
                            </Stack>
                            {showBarcode &&
                                <Typography
                                    fontFamily="monospace"
                                >
                                    [{barcode}]
                                </Typography>
                            }
                        </Stack>
                    }
                    secondaryTypographyProps={{ component: "div" }}
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
