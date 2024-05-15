import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { Add, MoreHoriz } from "@mui/icons-material";
import { Button, Chip, CircularProgress, Grid, List, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import { useSettings } from "../Settings/settings";
import ControllerView from "../Helpers/ControllerView";
import { usePersons } from "../Persons/PersonsApiQueries";
import { listsQueryKey } from "../Lists/ListsApiQueries";
import { ReceiptsListItem } from "../Receipts/ReceiptsController/ReceiptsList";
import { eventsQueryKey } from "../Events/EventsApiQueries";
import { startOfWeek } from "../Helpers/dateTime";
import { EventsListItem } from "../Events/EventsList";
import { useBalances } from "../Balance/BalanceApiQueries";
import { formatEuro } from "../Helpers/monetary";


export default function Dashboard() {
    const [{ userId }] = useSettings();
    const { getPerson } = usePersons();

    if (!userId) {
        return <Navigate to="/settings" />;
    }

    const user = getPerson(userId);

    return (
        <ControllerView
            title={`Welkom ${user?.name}`}
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

                <Card title="Weekplanning" button={
                    <Button
                        component={Link} to="/events/new"
                        variant="contained"
                        startIcon={<Add />}
                    >
                        Event
                    </Button>
                }>
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
        </ControllerView>
    );
}

function Card({ title, button, children }) {
    return (
        <Grid item zeroMinWidth xs={6} sm={6}>
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

function Balance({ userId }) {
    const { isError, error, isLoading, data } = useBalances();

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
                    {data.map(person =>
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
    const { data } = useQuery({
        queryKey: [listsQueryKey, null,
            {
                page_size: 5, type: 2, payer: userId,
                ordering: '-date_created'
            }
        ]
    })

    const recentReceipts = data?.results || [];

    return (
        <Stack width={1} spacing={1}>
            <Stack component={Paper} variant="outlined">
                <List disablePadding>
                    {recentReceipts.map((item) =>
                        <Fragment key={item.id}>
                            <ReceiptsListItem item={item} />
                        </Fragment>
                    )}
                </List>
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
    const weekStart = startOfWeek();
    const weekEnd = new Date(weekStart.valueOf() + (7 * 86400 - 1) * 1000);
    const { data } = useQuery({
        queryKey: [eventsQueryKey, null,
            {
                page_size: 100,
                event_date__gte: weekStart.toISOString(),
                event_date__lte: weekEnd.toISOString()
            }
        ]
    })

    const events = data?.results || [];

    return (
        <Stack spacing={1}>
            <Stack component={Paper} variant="outlined">
                <List disablePadding>
                    {events.map((item) =>
                        <Fragment key={item.id}>
                            <EventsListItem item={item} />
                        </Fragment>
                    )}
                </List>
                <Button
                    component={Link} to="/events"
                    startIcon={<MoreHoriz />}
                >
                    Alle events
                </Button>
            </Stack>
        </Stack>
    );
}