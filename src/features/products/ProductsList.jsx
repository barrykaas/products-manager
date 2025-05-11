import { Fragment } from "react";
import { List } from "@mui/material";

import { linkOrOnClick } from "src/utils/linkOrOnClick";
import { ProductsListItem } from "./ProductsListItem";


export function ProductsList({
    products = [],
    getListItemProps = () => ({}),
    onClickProduct,
    onEditProduct,
    ...props
}) {
    return (
        <List
            sx={{ width: 1 }}
            {...props}
        >
            {products.map((product) =>
                <Fragment key={product.id}>
                    <ProductsListItem
                        product={product}
                        {...linkOrOnClick(onClickProduct)}
                        {...getListItemProps(product)}
                        onEdit={onEditProduct}
                    />
                </Fragment>
            )}
        </List>
    );
}
