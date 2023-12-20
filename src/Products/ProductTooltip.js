import { Tooltip, Typography } from "@mui/material";

import useHumanReadableProduct from "./HumanReadableProduct";


export default function ProductTooltip({ product, children }) {
    const { formatProductDescription } = useHumanReadableProduct();

    const tooltip = (
        <>
            <Typography variant="caption" fontFamily="monospace">
                ID: {product.id}
            </Typography>
            <Typography>
                {formatProductDescription(product)}
            </Typography>
        </>
    );

    return (
        <Tooltip arrow title={tooltip}>
            {children}
        </Tooltip>
    );
}
