import { List, Paper } from "@mui/material";
import { Fragment, useState } from "react";

import groupByProperty from "../../Helpers/groupBy";
import { useListItems } from "../../Lists/ListsApiQueries";
import ReceiptEventBlock from "./ReceiptEventBlock";
import FormDialog from "../../Helpers/FormDialog";
import ProductController from "../../Products/ProductController";
import { useListItemMutator } from "../../Lists/ListsApiQueries";


export default function ReceiptEditor({ receiptId }) {
    const receiptItemsQuery = useListItems({ listId: receiptId });
    const [eventPickingProduct, setEventPickingProduct] = useState(null);
    const createEditListItem = useListItemMutator({
        onSuccess: () => setEventPickingProduct(null)
    });

    function onAddProduct(eventId) {
        setEventPickingProduct(eventId);
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

    const events = groupByProperty(receiptItemsQuery.data, 'event');

    return (
        <>
            <Paper>
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
