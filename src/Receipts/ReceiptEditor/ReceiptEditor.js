import { Typography, Button, Stack, Box, Tooltip } from "@mui/material";
import { Fragment, useState } from "react";

import groupByProperty from "../../Helpers/groupBy";
import { useListItems } from "../../Lists/ListsApiQueries";
import ReceiptEventBlock, { QuickAddBlock } from "./ReceiptEventBlock";
import FormDialog from "../../Helpers/FormDialog";
import ProductController from "../../Products/ProductController";
import { useListItemMutator } from "../../Lists/ListsApiQueries";
import EventController from "../../Events/EventController";
import { formatEuro } from "../../Helpers/monetary";
import { useUnitTypes } from "../../UnitTypes/UnitTypeQueries";
import { useEventMutator } from "../../Events/EventsApiQueries";
import { emptyForm as emptyEventForm } from "../../Events/EventForm";


export default function ReceiptEditor({ receiptId }) {
    const receiptItemsQuery = useListItems({ listId: receiptId });
    const { getUnitType } = useUnitTypes();
    const [eventPickingProduct, setEventPickingProduct] = useState(null);
    const [isPickingEvent, setIsPickingEvent] = useState(false);

    const createEditListItem = useListItemMutator({
        onSuccess: () => setEventPickingProduct(null)
    });
    const quickCreateEvent = useEventMutator();
    const quickEvent = {
        ...emptyEventForm(),
        name: "Nieuw event"
    };

    function onAddDiscount(eventId) {
        const createAmountItem = (eventId) => createEditListItem({
            product_price: 0,
            list: receiptId,
            event: eventId
        });

        if (eventId === -1) {
            quickCreateEvent(quickEvent, {
                onSuccess: (response) => {
                    const newEvent = response.data;
                    createAmountItem(newEvent.id);
                }
            })
        } else {
            createAmountItem(eventId);
        }
    }

    function onAddProduct(eventId) {
        setEventPickingProduct(eventId);
    }

    function handleSelectedEvent(event) {
        setIsPickingEvent(false);
        setEventPickingProduct(event.id);
    }

    function handleSelectedProduct(product) {
        let quantity, price;
        if (getUnitType(product.unit_type)?.discrete) {
            quantity = 1; price = product.unit_price;
        } else {
            quantity = product.unit_weightvol;
            price = product.unit_price / quantity;
        }

        const createProductItem = (eventId) => createEditListItem({
            product_id: product.id,
            product_quantity: quantity,
            product_price: price,
            list: receiptId,
            event: eventId
        });

        if (eventPickingProduct === -1) {
            quickCreateEvent(quickEvent, {
                onSuccess: (response) => {
                    const newEvent = response.data;
                    createProductItem(newEvent.id);
                }
            })
        } else {
            createProductItem(eventPickingProduct);
        }
    }

    if (receiptItemsQuery.isLoading) {
        return <div>Items worden geladen...</div>
    }
    if (receiptItemsQuery.isError) {
        return <div>Error: {JSON.stringify(receiptItemsQuery.error)}</div>;
    }

    const allReceiptItems = receiptItemsQuery.data;
    const noReceiptItems = allReceiptItems.length === 0;
    const events = groupByProperty(allReceiptItems, 'event');
    const receiptTotal = allReceiptItems.reduce((total, item) =>
        total + item.amount, 0);

    return (
        <>
            <Box sx={{ py: 2 }}>
                {/* Header, add event */}
                <Stack sx={{ px: 2 }}
                    direction="row" alignItems="center" justifyContent="space-between">
                    <Tooltip arrow title={
                        <Typography variant="caption" fontFamily="monospace">List ID: {receiptId}</Typography>
                    }>
                        <Typography variant="h5" component="h5" color="text.primary">
                            Producten
                        </Typography>
                    </Tooltip>
                    <Button onClick={() => setIsPickingEvent(true)}>
                        Kies event
                    </Button>
                </Stack>

                {/* Event blocks */}
                <Stack sx={{ mx: 1, my: 2 }}
                    spacing={2}
                >
                    <QuickAddBlock
                        onAddProduct={() => onAddProduct(-1)}
                        onAddAmount={() => onAddDiscount(-1)}
                    />

                    {Object.keys(events).map((eventId) => (
                        <Fragment key={eventId}>
                            <ReceiptEventBlock
                                eventId={eventId}
                                eventItems={events[eventId]}
                                onAddProduct={() => onAddProduct(eventId)}
                                onAddDiscount={() => onAddDiscount(eventId)}
                            />
                        </Fragment>
                    ))}
                </Stack>


                {/* Footer, totals */}
                <Stack sx={{ px: 3 }}
                    direction="row" alignItems="center" justifyContent="space-between"
                >
                    <Typography variant="h6" component="h5" color="text.primary">
                        Totaal
                    </Typography>
                    <Typography variant="h6" component="h5" color="text.primary">
                        {formatEuro(receiptTotal)}
                    </Typography>
                </Stack>
            </Box>


            {/* Event picker */}
            <FormDialog
                hasToolbar={false}
                title={"Selecteer product"}
                open={isPickingEvent}
                onClose={() => setIsPickingEvent(false)}
            >
                <EventController
                    handleSelectedEvent={handleSelectedEvent}
                    onClose={() => setIsPickingEvent(false)}
                />
            </FormDialog>

            {/* Product picker */}
            <FormDialog
                hasToolbar={false}
                title={"Selecteer product"}
                open={eventPickingProduct}
            >
                <ProductController
                    onClose={() => setEventPickingProduct(null)}
                    handleSelectedProduct={handleSelectedProduct}
                />
            </FormDialog>
        </>
    );
}
