import { Tooltip } from "@mui/material";

import useHumanReadableProduct from "./HumanReadableProduct";


export default function ProductTooltip({ product, children }) {
    const { formatProductDescription } = useHumanReadableProduct();

    const tooltip = formatProductDescription(product);

    return (
        <Tooltip arrow title={tooltip}>
            {children}
        </Tooltip>
    );
}
