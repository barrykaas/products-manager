import { Tooltip } from "@mui/material";

import { productQuantityDescription } from "../Helpers/productQuantity";


export default function ProductTooltip({ product, children }) {
    if (!product) return <>{children}</>;

    const tooltip = productQuantityDescription(product);

    return (
        <Tooltip arrow title={tooltip}>
            {children}
        </Tooltip>
    );
}
