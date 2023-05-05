import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Skeleton, Typography, Button, ButtonGroup, ListItemSecondaryAction, Grid, Box, Chip } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { getBrandsFn, getShoppingListFn } from "./ShoppingListApiQueries";

function ShoppingListProductItem({ item }) {
    const { isLoading, isError, data, error } = useQuery({ queryKey: ['brands'], queryFn: getBrandsFn })

    const quantityMutation = useMutation({
        mutationFn: async (updatedItem) => {
             const data = await axios.patch(`https://django.producten.kaas/api/listitems/${item.id}`, updatedItem)
             return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos', item.id]});
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
        quantityMutation.mutate({'product_quantity': item.product_quantity -1})
    }

    if (isLoading || isError) {
        return <Skeleton />
    }

    const brand = data.data.filter(brand_item => item.product.brand === brand_item.id)[0].name

    return (

        <Box>
            <Box sx={{ my: 1, mx: 2 }}>
                <Grid container alignItems="center">
                    <Grid item xs={0.5}>
                        {item.product_quantity}x
                    </Grid>
                    <Grid item xs>
                        <Typography gutterBottom variant="h5" component="div">
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
                    <Button onClick={() => decreaseQuantity()}>-</Button>
                </ButtonGroup>
            </Box>


        </Box>


    )
}



export default function ShoppingListItemForm({ id }) {
    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['shoppinglist', id],
        queryFn: async () => {
            const data = await getShoppingListFn(id)
            return data.data
        },
    })

    if (isError) {
        return <p>{JSON.stringify(error)}</p>
    }

    if (isLoading) {
        return <Skeleton />
    }



    return (
        <List sx={{ width: '100%' }}>
            {data.items.map(item => (
                <React.Fragment key={item.id}>
                    <ShoppingListProductItem item={item} />
                    <Divider component="li" />
                </React.Fragment>
            ))}
        </List>
    )
};

