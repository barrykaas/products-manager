import { Skeleton, Stack, Typography } from "@mui/material";

import BrandLabel from "../Brands/BrandLabel";
import ProductTooltip from "./ProductTooltip";
import { useProduct } from "./api";


export default function ProductCard({ productId, ...props }) {
    const { isLoading, isError, error, data } = useProduct(productId);
    const product = data;

    if (isError) return <div>Error: {JSON.stringify(error)}</div>;

    return (
        <Stack
            sx={{ width: 1 }}
            {...props}
        >
            <BrandLabel
                brandId={product?.brand}
                variant="subtitle2"
                color="text.secondary"
            />
            <Typography>
                {isLoading ?
                    <Skeleton />
                    :
                    <ProductTooltip product={product}>
                        {product.name}
                    </ProductTooltip>
                }
            </Typography>
        </Stack>
    );
}
