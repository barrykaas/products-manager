import { Divider, List, InputAdornment, FilledInput, TextField, Skeleton, Typography, Button, ButtonGroup, Grid, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import { getShoppingListFn, useListItemMutator, useListItemDeleter } from "./ShoppingListApiQueries";
import ShoppingListEventLabel from "./ShoppingListEventLabel";
import { useBrands } from "../Brands/BrandsApiQueries";


function ReceiptDiscountItem({ item }) {
    const discount = item.discount;
    const [discountFieldValue, setDiscountFieldValue] = useState(discount);
    const mutateListItem = useListItemMutator();
    const deleteListItem = useListItemDeleter();

    const onClickUpdate = () => {
        const newItem = {
            id: item.id,
            discount: discountFieldValue
        };
        mutateListItem(newItem);
    };

    const onClickDelete = () => {
        deleteListItem(item.id);
    };


    return (
        <Box>

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
                            value={discountFieldValue}
                            onChange={(event) => setDiscountFieldValue(event.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <Button onClick={onClickUpdate} >Update</Button>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 1, mb: 2, ml: 2 }}>
                    <Button color="error" onClick={onClickDelete} >Verwijder</Button>
                </Box>
            </Box>
        </Box>
    );
}

function ReceiptProductItem({ item }) {
    const mutateListItem = useListItemMutator();
    const deleteListItem = useListItemDeleter();

    const product = item.product;

    const brandsQuery = useBrands();
    const brandName = brandsQuery.getBrand(product.brand)?.name;

    const isLoading = brandsQuery.isLoading;
    const isError = brandsQuery.isError;

    if (isLoading || isError) {
        return <Skeleton />
    }

    const increaseQuantity = () => {
        mutateListItem({
            id: item.id,
            product_quantity: item.product_quantity + 1
        })
    }

    const disabledDecrease = (item.product_quantity === 1)
    const decreaseQuantity = () => {
        if ((item.product_quantity - 1) > 0) {
            mutateListItem({
                id: item.id,
                product_quantity: item.product_quantity - 1
            })
        }
    }

    const removeItem = () => {
        deleteListItem(item.id);
    };


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
                            {product.name}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant="h6" component="div">
                            €{product.unit_price}
                        </Typography>
                    </Grid>
                </Grid>
                <Typography color="text.secondary" variant="body2">
                    {brandName}
                </Typography>
            </Box>
            <Box sx={{ mt: 1, mb: 2, ml: 2 }}>
                <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
                    <Button onClick={() => increaseQuantity()}>+</Button>
                    <Button disabled={disabledDecrease} onClick={() => decreaseQuantity()}>-</Button>
                    <Button color="error" onClick={removeItem} >Verwijder</Button>
                </ButtonGroup>
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
        return <div>Geen product en ook geen korting?</div>;
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


    if (isError) {
        return <p>{JSON.stringify(error)}</p>
    }
    if (isLoading) {
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
