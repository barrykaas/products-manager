import { Typography, Button, Stack, Box, Tooltip, ButtonGroup } from "@mui/material";
import { Fragment, useState } from "react";
import { Add, List } from "@mui/icons-material";

import groupByProperty from "../../Helpers/groupBy";
import { useListItems } from "../../Lists/ListsApiQueries";
import ReceiptEventBlock from "./ReceiptEventBlock";
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
    const [eventPickingProduct, setEventPickingProduct] = useState(-1);
    const [eventPickerOpen, setEventPickerOpen] = useState(false);
    const [currentEvents, setCurrentEvents] = useState([]);

    const createEditListItem = useListItemMutator({
        onSuccess: () => setEventPickingProduct(-1)
    });

    const createEvent = useEventMutator();

    const onNewEvent = () => createEvent({
        ...emptyEventForm(),
        name: "Nieuw event"
    }, {
        onSuccess: (response) => {
            const newEvent = response.data;
            setCurrentEvents([newEvent.id, ...currentEvents]);
        }
    });

    const onAddDiscount = (eventId) => createEditListItem({
        product_price: 0,
        list: receiptId,
        event: eventId
    });

    function onAddProduct(eventId) {
        setEventPickingProduct(eventId);
    }

    function handleSelectedEvent(event) {
        setEventPickerOpen(false);
        setCurrentEvents([event.id, ...currentEvents]);
    }

    const handleSelectedProduct = (product) => {
        let quantity, price;
        if (getUnitType(product.unit_type)?.discrete) {
            quantity = 1; price = product.unit_price;
        } else {
            quantity = product.unit_weightvol;
            price = product.unit_price / quantity;
        }

        createEditListItem({
            product_id: product.id,
            product_quantity: quantity,
            product_price: price,
            list: receiptId,
            event: eventPickingProduct
        });
    }

    if (receiptItemsQuery.isLoading) {
        return <div>Items worden geladen...</div>
    }
    if (receiptItemsQuery.isError) {
        return <div>Error: {JSON.stringify(receiptItemsQuery.error)}</div>;
    }

    const allReceiptItems = receiptItemsQuery.data;
    const [events, existingEventIds] = groupByProperty(allReceiptItems, 'event');

    existingEventIds.sort().reverse();
    const eventIds = [...currentEvents];
    existingEventIds.forEach(eventId => {
        if (!eventIds.includes(eventId)) eventIds.push(eventId);
    });

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
                    <ButtonGroup>
                        <Button onClick={() => setEventPickerOpen(true)} startIcon={<List />}>
                            Kies event
                        </Button>
                        <Button onClick={onNewEvent} color="secondary" startIcon={<Add />}>
                            Nieuw event
                        </Button>
                    </ButtonGroup>
                </Stack>

                {/* Event blocks */}
                <Stack sx={{ mx: 1, my: 2 }}
                    spacing={2}
                >
                    {eventIds.map((eventId) => (
                        <Fragment key={eventId}>
                            <ReceiptEventBlock
                                eventId={eventId}
                                eventItems={events[eventId] || []}
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
                open={eventPickerOpen}
            >
                <EventController
                    handleSelectedEvent={handleSelectedEvent}
                    onClose={() => setEventPickerOpen(false)}
                />
            </FormDialog>

            {/* Product picker */}
            <FormDialog
                hasToolbar={false}
                title={"Selecteer product"}
                open={eventPickingProduct !== -1}
            >
                <ProductController
                    onClose={() => setEventPickingProduct(-1)}
                    handleSelectedProduct={handleSelectedProduct}
                />
            </FormDialog>
        </>
    );
}
