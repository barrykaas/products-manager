import { List, Paper, Grid, Typography, Button } from "@mui/material";
import { Fragment, useState } from "react";

import groupByProperty from "../../Helpers/groupBy";
import { useListItems } from "../../Lists/ListsApiQueries";
import ReceiptEventBlock from "./ReceiptEventBlock";
import FormDialog from "../../Helpers/FormDialog";
import ProductController from "../../Products/ProductController";
import { useListItemMutator } from "../../Lists/ListsApiQueries";
import EventsList from "../../Events/EventsList";
import EventController from "../../Events/EventController";


export default function ReceiptEditor({ receiptId }) {
    const receiptItemsQuery = useListItems({ listId: receiptId });
    const [eventPickingProduct, setEventPickingProduct] = useState(null);
    const [isPickingEvent, setIsPickingEvent] = useState(false);
    const createEditListItem = useListItemMutator({
        onSuccess: () => setEventPickingProduct(null)
    });

    function onAddProduct(eventId) {
        setEventPickingProduct(eventId);
    }

    function handleSelectedEvent(event) {
        setIsPickingEvent(false);
        setEventPickingProduct(event.id);
    }

    function handleSelectedProduct(product) {
        createEditListItem({
            product_id: product.id,
            product_quantity: 1,
            product_price: product.unit_price,
            list: receiptId,
            event: eventPickingProduct
        })
    }

    if (receiptItemsQuery.isLoading) {
        return <div>Items worden geladen...</div>
    }
    if (receiptItemsQuery.isError) {
        return <div>Error: {JSON.stringify(receiptItemsQuery.error)}</div>;
    }

    const allReceiptItems = receiptItemsQuery.data;
    const events = groupByProperty(allReceiptItems, 'event');

    return (
        <>
            {/* Header, add event */}
            <Grid container alignItems="center">
                <Grid item xs>
                    <Typography variant="h5" component="h5" color="text.primary">
                        Producten
                    </Typography>
                </Grid>
                <Grid item>
                    <Button onClick={() => setIsPickingEvent(true)}>Add event</Button>
                </Grid>
            </Grid>

            {/* Event blocks */}
            <Paper sx={{ mt: 1 }} hidden={!allReceiptItems.length}>
                <List sx={{ width: '100%' }}>
                    {Object.keys(events).map((eventId) => (
                        <Fragment key={eventId}>
                            <ReceiptEventBlock
                                eventId={eventId}
                                eventItems={events[eventId]}
                                onAddProduct={() => onAddProduct(eventId)}
                            />
                        </Fragment>
                    ))}
                </List>
            </Paper>

            {/* Event picker */}
            <FormDialog
                hasToolbar={false}
                title={"Selecteer product"}
                open={isPickingEvent}
                onClose={() => setIsPickingEvent(false)}
            >
                <EventController
                    handleSelectedEvent={handleSelectedEvent}
                />
            </FormDialog>

            {/* Product picker */}
            <FormDialog
                hasToolbar={false}
                title={"Selecteer product"}
                open={eventPickingProduct}
                onClose={() => setEventPickingProduct(null)}
            >
                <ProductController handleSelectedProduct={handleSelectedProduct} />
            </FormDialog>
        </>
    );
}
