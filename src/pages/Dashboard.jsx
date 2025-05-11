import { Link, Navigate } from "react-router";
import { Fragment, useRef, useState } from "react";
import { Button, Chip, CircularProgress, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import Page from "src/components/ui/Page";
import { usePerson } from "src/features/persons";
import { useSettings } from "src/hooks/useSettings";
import { formatEuro } from "src/utils/monetary";
import { useBalance } from "src/features/balance";
import { ReceiptsList, usePaginatedReceipts } from "src/features/receipts";
import { EventsWeekView } from "src/features/events";
import { SearchParamsProvider } from "src/context/searchParams";
import { EventFormDialog } from "src/features/events";
import { Add, MoreHoriz } from "src/components/icons";


export default function Dashboard() {
    const [{ userId }] = useSettings();
    const user = usePerson(userId).data;

    if (!userId) {
        return <Navigate to="/settings" />;
    }

    return (
        <Page
            title={'Welkom ' + (user?.name || '?')}
        >
            <Grid container
                spacing={4}
                sx={{ p: 2 }}
                columns={{ xs: 6, sm: 6, md: 12 }}
            >
                <Card title="Recent ingevuld" button={
                    <Button
                        component={Link} to="/receipts/new"
                        variant="contained"
                        startIcon={<Add />}
                    >
                        Bonnetje
                    </Button>
                }>
                    <MyRecentReceipts userId={userId} />
                </Card>

                <Card title="Weekplanning">
                    <ThisWeek />
                </Card>

                <Card title="Stand van zaken"
                    button={
                        <Button component={Link}
                            to="/balance"
                            startIcon={<MoreHoriz />}
                        >Meer info</Button>
                    }
                >
                    <Balance userId={userId} />
                </Card>
            </Grid>
        </Page>
    );
}

function Card({ title, button, children }) {
    return (
        <Grid item size={6}>
            <Stack
                justifyContent="space-between"
                pb={1}
                spacing={2}
                direction="row"
                alignItems="center"
            >
                <Typography variant="h6">{title}</Typography>
                {button}
            </Stack>
            {children}
        </Grid>
    );
}

const isKaas = (person) => person.id <= 5;

function Balance({ userId }) {
    const { isError, error, isLoading, data } = useBalance();

    if (isLoading) {
        return <CircularProgress />;
    }
    if (isError) {
        return <div>Error: {JSON.stringify(error)}</div>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Naam</TableCell>
                        <TableCell>Stand</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.filter(isKaas).map(person =>
                        <Fragment key={person.id}>
                            <TableRow selected={person.id === userId} hover>
                                <TableCell>{person.name}</TableCell>
                                <TableCell>
                                    <Chip label={formatEuro(person.balance)}
                                        color={person.balance < 0 ? "error" : "success"} />
                                </TableCell>
                            </TableRow>
                        </Fragment>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function MyRecentReceipts({ userId }) {
    const { data } = usePaginatedReceipts({
        page_size: 5, payer: userId,
        ordering: '-date_created'
    });

    const recentReceipts = data ? data.pages[0].results : [];

    return (
        <Stack width={1} spacing={1}>
            <Stack component={Paper} variant="outlined">
                <ReceiptsList
                    receipts={recentReceipts}
                    disablePadding
                />
                <Button
                    component={Link} to={`/receipts?payer=${userId}`}
                    startIcon={<MoreHoriz />}
                >
                    Al mijn bonnetjes
                </Button>
            </Stack>
        </Stack>
    );
}

function ThisWeek() {
    const [editorOpen, setEditorOpen] = useState(false);
    const editingEvent = useRef({});
    const onSelectEvent = (event) => {
        editingEvent.current = event;
        setEditorOpen(true);
    }

    return (
        <>
            <SearchParamsProvider>
                <EventsWeekView
                    sx={{ m: 0 }}
                    onSelectEvent={onSelectEvent}
                />
            </SearchParamsProvider>
            <EventFormDialog
                open={editorOpen}
                onClose={() => setEditorOpen(false)}
                initialValues={editingEvent.current}
                onSuccessfulCreateEdit={() => setEditorOpen(false)}
            />
        </>
    );
}
