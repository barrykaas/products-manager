import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { Add, MoreHoriz } from "@mui/icons-material";
import { Button, Grid, List, Paper, Stack, Typography } from "@mui/material";

import { useSettings } from "../Settings/settings";
import ControllerView from "../Helpers/ControllerView";
import { usePersons } from "../Persons/PersonsApiQueries";
import { listsQueryKey } from "../Lists/ListsApiQueries";
import { ReceiptsListItem } from "../Receipts/ReceiptsController/ReceiptsList";


export default function Dashboard() {
    const [{ userId }] = useSettings();
    const { getPerson } = usePersons();

    if (!userId) {
        return <Navigate to="/settings" />;
    }

    const user = getPerson(userId);

    return <ControllerView
        title={`Welkom ${user?.name}`}
    >
        <Grid container
            spacing={2}
            sx={{ p: 2 }}
        >
            <Grid item>
                <Stack
                    justifyContent="space-between"
                    pb={1}
                    spacing={2}
                    direction="row"
                >
                    <Typography variant="h6">Recent ingevuld</Typography>
                    <Button
                        component={Link} to="/receipts/new"
                        variant="contained"
                        startIcon={<Add />}
                    >
                        Nieuw bonnetje
                    </Button>
                </Stack>
                <MyRecentReceipts userId={userId} />
            </Grid>
        </Grid>
    </ControllerView>;
}

function MyRecentReceipts({ userId }) {
    const { data } = useQuery({
        queryKey: [listsQueryKey, null,
            { page_size: 5, type: 2, payer: userId }
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
