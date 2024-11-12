import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { Button, CircularProgress, Divider, List, Paper, Stack, Tab, Tabs } from "@mui/material";
import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoreHoriz } from "@mui/icons-material";

import ControllerView from "../Helpers/ControllerView";
import { EventForm } from "./EventForm";
import { ReceiptsListItem } from "../Receipts/ReceiptsController/ReceiptsList";
import { apiLocations } from "../Api/Common";
import TabPanel from "../Helpers/TabPanel";
import ReceiptItemTable from "../Receipts/ReceiptItemTable";
import { receiptItemsQueryKey } from "../Receipts/api";


export default function EventFormView() {
    const initialValues = useLoaderData();
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);

    return (
        <ControllerView
            title="Bewerk Event"
            onBack={() => navigate(-1)}
            maxWidth="sm"
        >
            <EventForm
                initialValues={initialValues}
                onSuccessfulCreateEdit={(event) => navigate(`../${event.id}`, { replace: true, relative: 'path' })}
                onSuccessfulDelete={() => navigate('..', { replace: true, relative: 'path' })}
            />

            {initialValues && initialValues.list_count > 0 &&
                <>
                    <Divider />
                    <Tabs
                        value={tab}
                        onChange={(e, newTab) => setTab(newTab)}
                    >
                        <Tab label="Items" id={0} />
                        <Tab label="Bonnetjes" id={1} />
                    </Tabs>
                    <TabPanel index={0} value={tab}>
                        <RelatedReceiptItems eventId={initialValues.id} />
                    </TabPanel>
                    <TabPanel index={1} value={tab}>
                        <RelatedReceipts eventId={initialValues.id} />
                    </TabPanel>
                </>
            }
        </ControllerView>
    );
}


function RelatedReceipts({ eventId }) {
    const { isError, error, isLoading, data } = useQuery({
        queryKey: [apiLocations.receipts, {
            event: eventId,
            page_size: 5
        }]
    });

    if (isError) {
        return <p>{JSON.stringify(error)}</p>;
    } else if (isLoading) {
        return <CircularProgress />;
    }

    const morePages = !!data.next;
    const lists = data.results || [];

    return (
        <Stack component={Paper}>
            <List disablePadding>
                {lists.map(list =>
                    <Fragment key={list.id}>
                        <ReceiptsListItem
                            item={list}
                        />
                    </Fragment>
                )}
            </List>
            {morePages &&
                <Button
                    component={Link} to={`/receipts?event=${eventId}`}
                    startIcon={<MoreHoriz />}
                >
                    Alle bonnetjes met dit event
                </Button>
            }
        </Stack>
    );
}


function RelatedReceiptItems({ eventId }) {
    const { isError, error, isLoading, data } = useQuery({
        queryKey: [receiptItemsQueryKey, {
            event: eventId,
            page_size: 10
        }]
    });

    if (isError) {
        return <p>{JSON.stringify(error)}</p>;
    } else if (isLoading) {
        return <CircularProgress />;
    }

    const morePages = !!data.next;
    const receiptItems = data.results || [];

    return (
        <>
            <ReceiptItemTable receiptItems={receiptItems} />
            {morePages &&
                <Button
                    component={Link}
                    to={`/receipt-items?event=${eventId}`}
                    startIcon={<MoreHoriz />}
                    fullWidth
                >
                    Alle items van dit event
                </Button>
            }
        </>
    );
}
