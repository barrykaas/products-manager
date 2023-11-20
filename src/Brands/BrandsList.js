import { CircularProgress, List, Divider, ListItem, ListItemText, ListItemButton, IconButton } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Fragment } from "react";

import { useBrandAdder, useBrands } from "./queries";
import { matchesSearch } from "../Helpers/search";


function BrandsListItem({ brand, handleSelect, handleDelete }) {
    return (
        <ListItem alignItems="flex-start" disablePadding secondaryAction={
            <IconButton aria-label="comment" onClick={handleDelete}>
                <DeleteForeverIcon />
            </IconButton>
        } >
            <ListItemButton onClick={handleSelect}>
                <ListItemText primary={brand.name} />
            </ListItemButton>
        </ListItem>
    );
}


function QuickAddSuggestion({ brandName, handleSelect }) {
    if (!brandName) return;
    const newBrandData = { name: brandName };

    return (
        <>
            <ListItem alignItems="flex-start" disablePadding>
                <ListItemButton onClick={handleSelect} >
                    <ListItemText primary={`Voeg nieuw merk toe: ${brandName}`} />
                </ListItemButton>
            </ListItem>
            <Divider component="li" />
        </>
    );
}


export default function BrandsList({ handleDelete, handleSelectBrand, searchQuery }) {
    const brands = useBrands();
    const addBrand = useBrandAdder();

    if (brands.isLoading) {
        return <CircularProgress />;
    }
    if (brands.isError) {
        return (<p>Error: {brands.error}</p>);
    }

    let filteredBrands = brands.data.data;
    if (searchQuery) {
        filteredBrands = filteredBrands.filter((brand) => matchesSearch(searchQuery, brand.name));
    }

    function quickAddBrand() {
        const newBrandData = { name: searchQuery };
        addBrand(newBrandData);
    };

    return (
        <>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <QuickAddSuggestion brandName={searchQuery} handleSelect={quickAddBrand} />

                {filteredBrands.map((item) => (
                    <Fragment key={item.id}>
                        <BrandsListItem brand={item} handleDelete={() => handleDelete(item)} />
                        <Divider component="li" />
                    </Fragment>
                ))}
            </List>
        </>
    );
}
