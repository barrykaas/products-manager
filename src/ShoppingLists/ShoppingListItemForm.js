import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Skeleton, Typography, Button, ButtonGroup, ListItemSecondaryAction, Grid, Box, Chip } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getBrandsFn, getShoppingListFn } from "./ShoppingListApiQueries";
import axios from "axios";
import ShoppingListEventLabel from "./ShoppingListEventLabel";

import apiPath from "../Api/ApiPath";

function ShoppingListProductItem({ item }) {
    const queryClient = useQueryClient()

    const { isLoading, isError, data, error } = useQuery({ queryKey: ['brands'], queryFn: getBrandsFn })

    const quantityMutation = useMutation({
        mutationFn: async (updatedItem) => {
             const data = await axios.patch(`${apiPath}/listitems/${item.id}/`, updatedItem)
             return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shoppinglistitems']});
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`Error`)
          },
    });

    const increaseQuantity = () => {
        quantityMutation.mutate({'product_quantity': item.product_quantity + 1})
    }

    const decreaseQuantity = () => {
        if((item.product_quantity - 1) > 0) {
            quantityMutation.mutate({'product_quantity': item.product_quantity -1})
        }
    }

    if (isLoading || isError) {
        return <Skeleton />
    }

    const disabledDecrease = (item.product_quantity === 1)

    const brand = data.data.filter(brand_item => item.product.brand === brand_item.id)[0].name

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
            <Box sx={{ mt:1, mb: 2, ml:2 }}>
                <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
                    <Button onClick={() => increaseQuantity()}>+</Button>
                    <Button disabled={disabledDecrease} onClick={() => decreaseQuantity()}>-</Button>
                </ButtonGroup>
            </Box>


        </Box>


    )
}



export default function ShoppingListItemForm({ id }) {
    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['shoppinglistitems'],
        queryFn: async () => {
            const data = await getShoppingListFn(id)
            return data.data
        },
    })

    const { isLoadingBrands, isErrorBrands, dataBrands, errorBrands } = useQuery({ queryKey: ['events'], queryFn: getBrandsFn })

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

    console.log(groupedEvents);

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
                    <ShoppingListEventLabel eventId={event} />
                    </Box>
                    <Divider component="li" />
                    <List sx={{ width: '100%' }}>
                    {groupedEvents[event].map(item => (
                        <React.Fragment key={item.id}>
                            <ShoppingListProductItem item={item} />
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

