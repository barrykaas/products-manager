import { ListItem, ListItemButton, IconButton } from "@mui/material";

import { ProductContent } from "./ProductCard";
import { Edit } from "src/components/icons";


export function ProductsListItem({ product, onClick, onEdit, disabled, showBarcode = false }) {
    const editButton = onEdit ?
        <IconButton
            aria-label="edit-product"
            onClick={() => onEdit(product)}
        >
            <Edit />
        </IconButton>
        : null;

    return (
        <ListItem
            disablePadding
            secondaryAction={editButton}
        >
            <ListItemButton
                disabled={disabled}
                divider
                onClick={() => onClick(product)}
            >
                <ProductContent
                    product={product}
                    showBarcode={showBarcode}
                    sx={[
                        { width: 1 },
                        onEdit && { pr: 2 }
                    ]}
                />
            </ListItemButton>
        </ListItem>
    );
}
