import React, { useState } from 'react';
import { Button, Alert, Snackbar, TextField, IconButton, InputAdornment, Paper } from '@mui/material';
import { ProductAppBar, ProductAppBarClosable } from './ProductsAppBar';
// import ProductsForm from '../Products/ProductsForm';

//import ButtonAppBar from './MyAppBar'


import FormDialog from '../Helpers/FormDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useConfirm } from 'material-ui-confirm';
import ProductsList from './ProductsList';
import { ProductCreateForm, ProductEditForm } from './ProductsForm';
import { Search } from '@mui/icons-material';

import apiPath from '../Api/ApiPath';


function ProductController({ handleSelectedProduct, onClose }) {
    const queryClient = useQueryClient();

    const [currentProduct, setCurrentProduct] = useState(null);

    const [messageOpen, setMessageOpen] = useState(false);

    const [messageText, setMessageText] = useState("");
    const [messageState, setMessageState] = useState(true);

    const [editOpen, setEditOpen] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setEditOpen(true);
    };

    const handleAddProduct = () => {
        setCreateOpen(true);
    };

    const didSuccessfullyCreate = (message) => {
        setCreateOpen(false);
        setMessageOpen(true);
        setMessageText(message);
    };

    const didSuccessfullyEdit = (message) => {
        setEditOpen(false);
        setMessageOpen(true);
        setMessageText(message);
    };

    const confirm = useConfirm();

    const deleteProductMutation = useMutation({
        mutationFn: async (itemId) => {
            const data = await axios.delete(`${apiPath}/products/${itemId}/`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`Error`);
        },
    });

    const handleRemoveClick = (product) => {
        confirm({ description: `Verwijderen van ${product.name}` })
            .then(() => {
                deleteProductMutation.mutate(product.id);
                didSuccessfullyEdit("Verwijderd!");
            })
            .catch(() => { });
    };

    return (
        <>
            <Snackbar open={messageOpen} autoHideDuration={1500} onClose={() => setMessageOpen(false)}>
                <Alert severity={messageState ? "success" : "error"} sx={{ width: "100%" }}>
                    {messageText}
                </Alert>
            </Snackbar>


            {onClose ? (
                <ProductAppBarClosable onClose={onClose} title={"Producten"} onAdd={handleAddProduct} />
            ) : (
                <ProductAppBar title={"Producten"} onAdd={handleAddProduct} />
            )}

            <Paper sx={{m:1, p:1}}>
                <TextField
                id="standard-search"
                label="Zoek"
                type="search"
                variant="standard"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
            />
            </Paper>

            <ProductsList handleEdit={handleEditProduct} handleSelectedProduct={handleSelectedProduct} searchQuery={searchQuery}/>

            <FormDialog title={"Producten"} open={createOpen} onClose={() => setCreateOpen(false)}>
                <ProductCreateForm didSuccessfullyCreate={didSuccessfullyCreate} />
            </FormDialog>

            {currentProduct ? (
                <FormDialog
                    title={"Producten"}
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    secondaryButtons={
                        <Button variant="contained" color={"error"} onClick={() => handleRemoveClick(currentProduct)}>
                            Verwijderen
                        </Button>
                    }
                >
                    <ProductEditForm didSuccessfullyEdit={didSuccessfullyEdit} item={currentProduct} />
                </FormDialog>
            ) : (
                <></>
            )}
        </>
    );
}

export default ProductController;