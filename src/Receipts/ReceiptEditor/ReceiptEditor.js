import { List } from "@mui/material";
import { Fragment } from "react";

import groupByProperty from "../../Helpers/groupBy";
import { useListItems } from "../../Lists/ListsApiQueries";
import ReceiptEventBlock from "./ReceiptEventBlock";


export default function ReceiptEditor({ receiptId }) {
    const receiptItemsQuery = useListItems({ listId: receiptId });

    if (receiptItemsQuery.isLoading) {
        return <div>Items worden geladen...</div>
    }
    if (receiptItemsQuery.isError) {
        return <div>Error: {JSON.stringify(receiptItemsQuery.error)}</div>;
    }

    const events = groupByProperty(receiptItemsQuery.data, 'event');

    return (
        <>
            <List>
                {Object.keys(events).map((eventId) => (
                    <Fragment key={eventId}>
                        <ReceiptEventBlock eventItems={events[eventId]} />
                    </Fragment>
                ))}
            </List>
        </>
    );
}
