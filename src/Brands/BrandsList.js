import { CircularProgress, List, Divider, ListItem, ListItemText, ListItemButton, IconButton } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Fragment } from "react";

import { addBrandFn, brandsQueryKey, useBrands } from "./queries";
import { matchesSearch } from "../Helpers/search";
import { useMutation, useQueryClient } from "@tanstack/react-query";


function BrandsListItem({ brand, handleSelect, handleDelete }) {
    return (
        <ListItem alignItems="flex-start" disablePadding secondaryAction={
            <IconButton aria-label="comment" onClick={() => handleDelete(brand)}>
                <DeleteForeverIcon />
            </IconButton>
        } >
            <ListItemButton onClick={handleSelect}>
                <ListItemText primary={brand.name} />
            </ListItemButton>
        </ListItem>
    );
}


function QuickAddSuggestion({ brandName, handleSelect, onAddSuccess, onAddError }) {

    const queryClient = useQueryClient();
    const brandMutation = useMutation({
        mutationFn: addBrandFn,
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries({ queryKey: [brandsQueryKey] });
            onAddSuccess();
        },
        onError: onAddError
    });

    if (!brandName) return;
    const newBrandData = { name: brandName };

    return (
        <>
            <ListItem alignItems="flex-start" disablePadding>
                <ListItemButton onClick={() => {
                    brandMutation.mutate(newBrandData);
                    handleSelect();
                }}>
                    <ListItemText primary={`Voeg nieuw merk toe: ${brandName}`} />
                </ListItemButton>
            </ListItem>
            <Divider component="li" />
        </>
    );
}


export default function BrandsList({ handleDelete, handleSelectBrand, searchQuery }) {
    const brands = useBrands();

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


    return (
        <>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <QuickAddSuggestion brandName={searchQuery} />

                {filteredBrands.map((item) => (
                    <Fragment key={item.id}>
                        <BrandsListItem brand={item}  />
                        <Divider component="li" />
                    </Fragment>
                ))}
            </List>
        </>
    );
}
