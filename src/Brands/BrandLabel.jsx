import { Skeleton, Typography } from "@mui/material";

import { useBrand } from "./api";


export default function BrandLabel({ brandId, ...props }) {
    const { isLoading, data } = useBrand(brandId);
    const brand = data;

    if (!brandId) return;

    return (
        <Typography {...props}>
            {isLoading ?
                <Skeleton />
                : brand.name
            }
        </Typography>
    );
}
