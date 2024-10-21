import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

import ProductsList from './ProductsList';
import { ProductFormDialog } from './ProductsForm';
import { useProductsInvalidator } from './ProductsApiQueries';
import ControllerView from '../Helpers/ControllerView';
import FilterDialog from '../Helpers/FilterDialog';
import useLocalSearchParams from '../Helpers/localSearchParams';


const filterOptions = [
    {
        param: "market",
        label: "Winkel",
        type: "market"
    }
];


export default function ProductController({ handleSelectedProduct, onClose, onMenu }) {
    const [currentProduct, setCurrentProduct] = useState(null);
    const [messageOpen, setMessageOpen] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageState] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [searchParams, setSearchParams] = useLocalSearchParams(!!onClose);
    const [filterOpen, setFilterOpen] = useState(false);

    const invalidateProducts = useProductsInvalidator();

    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setEditOpen(true);
    };

    const handleAddProduct = () => {
        setCurrentProduct({});
        setEditOpen(true);
    };

    const didSuccessfullyEdit = (message) => {
        setEditOpen(false);
        setMessageOpen(true);
        setMessageText(message);
    };

    const onRefresh = invalidateProducts;

    const handleNewSearch = (newSearch) => {
        if (newSearch) {
            searchParams.set('search', newSearch);
        } else {
            searchParams.delete('search')
        }
        setSearchParams(searchParams);
    };

    return (
        <>
            <Snackbar open={messageOpen} autoHideDuration={1500} onClose={() => setMessageOpen(false)}>
                <Alert severity={messageState ? "success" : "error"} sx={{ width: "100%" }}>
                    {messageText}
                </Alert>
            </Snackbar>

            <ControllerView
                title={onClose ? "Kies product" : "Producten"}
                onAdd={handleAddProduct}
                onClose={onClose}
                onMenu={onMenu}
                onRefresh={onRefresh}
                initialSearch={searchParams.get('search') || ''}
                handleNewSearch={handleNewSearch}
                onFilter={() => setFilterOpen(true)}
            >
                <ProductsList
                    handleEdit={handleEditProduct}
                    handleSelectedProduct={handleSelectedProduct}
                    searchParams={searchParams}
                />
            </ControllerView>

            <ProductFormDialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                initialValues={currentProduct}
                onSuccessfulCreateEdit={() => didSuccessfullyEdit("Gelukt!")}
            />

            <FilterDialog
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                options={filterOptions}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
        </>
    );
}
