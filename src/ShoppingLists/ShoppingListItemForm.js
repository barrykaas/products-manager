import { Divider, List, InputAdornment, FilledInput, TextField, Skeleton, Typography, Button, ButtonGroup, Grid, Box, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import { getShoppingListFn, useListItemMutator, useListItemDeleter } from "./ShoppingListApiQueries";
import ShoppingListEventLabel from "./ShoppingListEventLabel";
import { useBrands } from "../Brands/BrandsApiQueries";
import ReceiptDiscountItem from "../Receipts/ReceiptEditor/ReceiptDiscountItem";
import ReceiptProductDiscreteItem from "../Receipts/ReceiptEditor/ReceiptProductDiscreteItem";
import useUnitTypeInfo from "../UnitTypes/UnitTypeInfo";
import ReceiptProductScalarItem from "../Receipts/ReceiptEditor/ReceiptProductScalarItem";


function ReceiptProductItem({ item }) {
    const { isLoading, isError, unitTypeInfo, error } = useUnitTypeInfo();

    if (isLoading || isError) {
        return <Skeleton />
    }

    if (unitTypeInfo(item.product.unit_type).discrete === true) {
        return <ReceiptProductDiscreteItem item={item} />;
    } else {
        return <ReceiptProductScalarItem item={item} />;
    }
}

export function ReceiptItem({ item }) {
    if (item.product) {
        return <ReceiptProductItem item={item} />;
    } else if (item.discount) {
        return <ReceiptDiscountItem item={item} />;
    } else {
        return <div>Geen product en ook geen korting?</div>;
    }
}



// export default function ShoppingListItemForm({ id, handleAddProduct }) {
//     const { isLoading, isError, data, error } = useQuery({
//         queryKey: ['shoppinglistitems', id],
//         queryFn: async () => {
//             const data = await getShoppingListFn(id)
//             return data.data
//         },
//     });


//     if (isError) {
//         return <p>{JSON.stringify(error)}</p>
//     }
//     if (isLoading) {
//         return <Skeleton />
//     }


//     const groupedEvents = {};

//     data.items.forEach(item => {
//         const eventID = item.event;
//         if (!groupedEvents.hasOwnProperty(eventID)) {
//             groupedEvents[eventID] = [];
//         }
//         groupedEvents[eventID].push(item);
//     });

//     // console.log(groupedEvents);

//     return (
//         <List sx={{ width: '100%' }}>

//             {/* {data.items.map(item => (
//                 <React.Fragment key={item.id}>
//                     <ShoppingListProductItem item={item} />
//                     <Divider component="li" />
//                 </React.Fragment>
//             ))} */}

//             {Object.keys(groupedEvents).map(event => (
//                 //<p>{event}</p>
//                 <React.Fragment key={event}>
//                     <Box sx={{ my: 1, mx: 2 }}>
//                         <ShoppingListEventLabel eventId={event} handleAddProduct={handleAddProduct} />
//                     </Box>
//                     <Divider component="li" />
//                     <List sx={{ width: '100%' }}>
//                         {groupedEvents[event].map(item => (
//                             <React.Fragment key={item.id}>
//                                 <ReceiptItem item={item} />
//                                 <Divider component="li" />
//                             </React.Fragment>
//                         ))}
//                     </List>
//                 </React.Fragment>
//             ))
//             }
//         </List>
//     )
// };


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
