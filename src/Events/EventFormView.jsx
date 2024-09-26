import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Divider, List, Paper, Stack, Typography } from "@mui/material";
import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoreHoriz } from "@mui/icons-material";

import ControllerView from "../Helpers/ControllerView";
import { EventForm } from "./EventForm";
import { ReceiptsListItem } from "../Receipts/ReceiptsController/ReceiptsList";


export default function EventFormView() {
    const initialValues = useLoaderData();
    const navigate = useNavigate();

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

            {initialValues && initialValues.lists.length > 0 &&
                <>
                    <Divider />
                    <RelatedLists event={initialValues} />
                </>
            }
        </ControllerView>
    );
}


function RelatedLists({ event }) {
    const { isError, error, isLoading, data } = useQuery({
        queryKey: ['lists', null, {
            event: event.id,
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
        <Box sx={{ mb: 5 }}>
            <Typography variant='h6'
                sx={{ my: 2 }}
            >
                Gerelateerde bonnetjes:
            </Typography>
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
                    <>
                        <Divider />
                        <Button
                            component={Link} to={`/receipts?event=${event.id}`}
                            startIcon={<MoreHoriz />}
                        >
                            Alle bonnetjes met dit event
                        </Button>
                    </>
                }
            </Stack>
        </Box>
    );
}
