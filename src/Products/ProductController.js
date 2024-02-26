import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

import ProductsList from './ProductsList';
import { ProductFormDialog } from './ProductsForm';
import { useProductsInvalidator } from './ProductsApiQueries';
import ControllerView from '../Helpers/ControllerView';


export default function ProductController({ handleSelectedProduct, onClose, onMenu }) {
    const [currentProduct, setCurrentProduct] = useState(null);
    const [messageOpen, setMessageOpen] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageState] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const invalidateProducts = useProductsInvalidator();

    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setEditOpen(true);
    };

    handleSelectedProduct = handleSelectedProduct ?? handleEditProduct;

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
                hasSearch
                searchQuery={searchQuery}
                onSearchQueryChange={(e) => {
                    console.log(e.target.value);
                    setSearchQuery(e.target.value)
                }}
            >
                <ProductsList
                    handleEdit={handleEditProduct}
                    handleSelectedProduct={handleSelectedProduct}
                    searchQuery={searchQuery}
                />
            </ControllerView>

            <ProductFormDialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                initialValues={currentProduct}
                onSuccessfulCreateEdit={() => didSuccessfullyEdit("Gelukt!")}
            />
        </>
    );
}
