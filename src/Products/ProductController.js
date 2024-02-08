import React, { useState } from 'react';
import { Alert, Snackbar, Box } from '@mui/material';

import { ProductAppBar } from './ProductsAppBar';
import ProductsList from './ProductsList';
import { ProductFormDialog } from './ProductsForm';
import { useProductsInvalidator } from './ProductsApiQueries';


export default function ProductController({ handleSelectedProduct, onClose }) {
    const [currentProduct, setCurrentProduct] = useState(null);
    const [messageOpen, setMessageOpen] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageState, setMessageState] = useState(true);
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
        <Box height={1}>
            <Snackbar open={messageOpen} autoHideDuration={1500} onClose={() => setMessageOpen(false)}>
                <Alert severity={messageState ? "success" : "error"} sx={{ width: "100%" }}>
                    {messageText}
                </Alert>
            </Snackbar>

            <ProductAppBar
                title={onClose ? "Kies product" : "Producten"}
                onAdd={handleAddProduct}
                onClose={onClose}
                onRefresh={onRefresh}
                searchQuery={searchQuery}
                onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
            />

            <ProductsList
                handleEdit={handleEditProduct}
                handleSelectedProduct={handleSelectedProduct}
                searchQuery={searchQuery}
            />

            <ProductFormDialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                initialValues={currentProduct}
                onSuccessfulCreateEdit={() => didSuccessfullyEdit("Gelukt!")}
            />
        </Box>
    );
}
