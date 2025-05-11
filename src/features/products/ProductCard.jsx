import { Typography, Stack, Card, CardContent, Box, Skeleton } from "@mui/material";

import { formatEuro } from "src/utils/monetary";
import { productQuantityDescription } from "src/utils/productQuantity";
import { useSettings } from "src/hooks/useSettings";
import { useBrand } from "src/features/brands";
import { formatUnitPrice } from "./friendlyInfo";
import IdLabel from "src/components/ui/IdLabel";


export function ProductContent({
    product,
    showBarcode = false,
    hidePrice = false,
    ...props
}) {
    const brand = useBrand(product?.brand).data;
    const [{ nerdInfo }] = useSettings();

    return (
        <Stack direction="row" justifyContent="space-between" {...props}>
            <Box>
                <Typography
                    sx={{
                        color: 'text.secondary',
                        fontSize: 12
                    }}
                >
                    {product?.brand === null ||
                        (brand?.name || <Skeleton width='8em' />)
                    }
                </Typography>
                <Typography width={1}>
                    {nerdInfo && <IdLabel id={product?.id} />}
                    {product?.name || <Skeleton width='12em' />}
                </Typography>
                {showBarcode && product?.barcode &&
                    <Typography fontFamily="monospace">
                        [{product.barcode}]
                    </Typography>
                }
                <Typography
                    sx={{
                        color: 'text.secondary',
                        fontSize: 12
                    }}
                >
                    {product ?
                        productQuantityDescription(product)
                        : <Skeleton width='10em' />}
                </Typography>

            </Box>
            {!hidePrice &&
                <Stack
                    alignItems="end"
                    ml={2}
                >
                    <Typography
                        noWrap
                        align="right"
                        sx={{
                            color: 'text.secondary',
                            fontSize: 12
                        }}
                    >
                        {product ? formatUnitPrice(product) : <Skeleton width='4em' />}
                    </Typography>
                    <Typography
                        noWrap
                        align="right"
                    >
                        {product ? formatEuro(product?.price) : <Skeleton width='5em' />}
                    </Typography>
                </Stack>
            }
        </Stack>
    );
}

export function ProductCard({ product, ...props }) {
    return (
        <Card {...props}>
            <CardContent>
                <ProductContent
                    product={product}
                />
            </CardContent>
        </Card>
    );
}
