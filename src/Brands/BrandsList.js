import { CircularProgress, List, Divider } from "@mui/material";
import { Fragment } from "react";

import { useBrands } from "./queries";
import { matchesSearch } from "../Helpers/search";


export default function BrandsList({ handleEdit, handleSelectBrand, searchQuery }) {
    const brands = useBrands();

    if (brands.isLoading) {
        return <CircularProgress />;
    }
    if (brands.isError) {
        return (<p>Error: {brands.error}</p>);
    }

    let filteredBrands = brands.data.data
    if (searchQuery) {
        filteredBrands = brands.data.data.filter((brand) => matchesSearch(searchQuery, brand.name));
    }

    return (
        <>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {filteredBrands.map((item) => (
                    <Fragment key={item.id}>
                        {/* <ProductsListItem item={item} handleEdit={handleEdit} handleSelectedProduct={() => handleSelectedProduct(item)} /> */}
                        <p>{item.name}</p>
                        <Divider component="li" />
                    </Fragment>
                ))}
            </List>
            {/* <Button disabled={!hasNextPage || isFetchingNextPage} onClick={() => fetchNextPage()}>Load more</Button> */}
        </>
    );
}
