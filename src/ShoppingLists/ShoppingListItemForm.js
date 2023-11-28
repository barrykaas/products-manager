import { Avatar, Divider, List, ListItem, ListItemAvatar, FormControl, InputLabel, InputAdornment, FilledInput, TextField, ListItemText, Skeleton, Typography, Button, ButtonGroup, ListItemSecondaryAction, Grid, Box, Chip } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { getBrandsFn, getShoppingListFn } from "./ShoppingListApiQueries";
import axios from "axios";
import ShoppingListEventLabel from "./ShoppingListEventLabel";

import apiPath from "../Api/ApiPath";
import FormDialog from "../Helpers/FormDialog";

import ProductController from "../Products/ProductController";
import { useBrands } from "../Brands/BrandsApiQueries";


function ReceiptDiscountItem({ item }) {
    const discount = item.discount;

    const onFieldChange = (event) => {
        console.log("change discount field:", event);
    };

    return (
        <Box sx={{ my: 1, mx: 2 }}>
            <Grid container alignItems="center">
                <Grid item xs>
                    <Typography gutterBottom variant="h6" component="div">
                        Korting
                    </Typography>
                </Grid>
                <Grid item>
                    <TextField
                        sx={{ m: 1, width: '10ch' }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">- €</InputAdornment>,
                        }}
                        variant="standard"
                        onChange={onFieldChange}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}


function ReceiptProductItem({ item }) {
    const queryClient = useQueryClient()

    const { isLoading, isError, data, error, getBrand } = useBrands();

    const quantityMutation = useMutation({
        mutationFn: async (updatedItem) => {
            const data = await axios.patch(`${apiPath}/listitems/${item.id}/`, updatedItem)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shoppinglistitems'] });
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`Error`)
        },
    });

    // remove mutation
    const removeMutation = useMutation({
        mutationFn: async (itemId) => {
            const data = await axios.delete(`${apiPath}/listitems/${itemId}/`)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shoppinglistitems'] });
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`Error`)
        },
    });

    const increaseQuantity = () => {
        quantityMutation.mutate({ 'product_quantity': item.product_quantity + 1 })
    }

    const decreaseQuantity = () => {
        if ((item.product_quantity - 1) > 0) {
            quantityMutation.mutate({ 'product_quantity': item.product_quantity - 1 })
        }
    }

    const removeItem = () => {
        removeMutation.mutate(item.id)
    };

    if (isLoading || isError) {
        return <Skeleton />
    }

    const disabledDecrease = (item.product_quantity === 1)

    const brand = getBrand(item.product.brand)?.name;

    return (

        <Box>
            <Box sx={{ my: 1, mx: 2 }}>
                <Grid container alignItems="center">
                    <Grid item xs={0.5}>
                        <Typography gutterBottom variant="overline" component="div">
                            {item.product_quantity}x
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <Typography gutterBottom variant="h6" component="div">
                            {item.product.name}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant="h6" component="div">
                            €{item.product.unit_price}
                        </Typography>
                    </Grid>
                </Grid>
                <Typography color="text.secondary" variant="body2">
                    {brand}
                </Typography>
            </Box>
            <Box sx={{ mt: 1, mb: 2, ml: 2 }}>
                <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
                    <Button onClick={() => increaseQuantity()}>+</Button>
                    <Button disabled={disabledDecrease} onClick={() => decreaseQuantity()}>-</Button>
                    <Button color="error" onClick={removeItem} >Verwijder</Button>
                </ButtonGroup>
                {/* <TextField
                    label="Korting"
                    variant="filled"
                    size="small"
                    hiddenLabel
                    startAdornment={<InputAdornment position="start">€</InputAdornment>}
                /> */}
                <FilledInput
                    size="small"
                    label="Korting"
                    startAdornment={<InputAdornment position="start">- €</InputAdornment>}
                />
            </Box>


        </Box>


    )
}



function ReceiptItem({ item }) {
    if (item.product) {
        return <ReceiptProductItem item={item} />;
    } else if (item.discount) {
        return <ReceiptDiscountItem item={item} />;
    } else {
        return <div>Geen product en ook geen discount?</div>;
    }
}




export default function ShoppingListItemForm({ id, handleAddProduct }) {
    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['shoppinglistitems', id],
        queryFn: async () => {
            const data = await getShoppingListFn(id)
            return data.data
        },
    });


    const { isLoadingBrands, isErrorBrands, dataBrands, errorBrands } = useQuery({ queryKey: ['brands'], queryFn: getBrandsFn })

    if (isError) {
        return <p>{JSON.stringify(error)}</p>
    }

    if (isErrorBrands) {
        return <p>{JSON.stringify(errorBrands)}</p>
    }

    if (isLoading || isLoadingBrands) {
        return <Skeleton />
    }


    const groupedEvents = {};

    data.items.forEach(item => {
        const eventID = item.event;
        if (!groupedEvents.hasOwnProperty(eventID)) {
            groupedEvents[eventID] = [];
        }
        groupedEvents[eventID].push(item);
    });

    // console.log(groupedEvents);

    return (
        <List sx={{ width: '100%' }}>

            {/* {data.items.map(item => (
                <React.Fragment key={item.id}>
                    <ShoppingListProductItem item={item} />
                    <Divider component="li" />
                </React.Fragment>
            ))} */}

            {Object.keys(groupedEvents).map(event => (
                //<p>{event}</p>
                <React.Fragment key={event}>
                    <Box sx={{ my: 1, mx: 2 }}>
                        <ShoppingListEventLabel eventId={event} handleAddProduct={handleAddProduct} />
                    </Box>
                    <Divider component="li" />
                    <List sx={{ width: '100%' }}>
                        {groupedEvents[event].map(item => (
                            <React.Fragment key={item.id}>
                                <ReceiptItem item={item} />
                                <Divider component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                </React.Fragment>
            ))
            }
        </List>
    )
};
