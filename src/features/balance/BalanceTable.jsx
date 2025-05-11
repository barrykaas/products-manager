import { ArrowForward } from "src/components/icons";
import { Chip, CircularProgress, Paper, Table, TableCell, TableContainer, TableHead, TableRow, Box, Stack, Typography, TableBody } from "@mui/material";
import { Fragment } from "react";

import { formatEuro } from "src/utils/monetary";
import { useSettings } from "src/hooks/useSettings";
import { useBalance } from "./api";


export function BalanceTable() {
    const { isError, error, isLoading, data, getPerson } = useBalance();

    if (isLoading) {
        return <CircularProgress />;
    }
    if (isError) {
        return <div>Error: {JSON.stringify(error)}</div>;
    }

    const toSettle = data.flatMap(person => person?.to_settle ?? [])

    const totalExpenses = data.reduce((part, person) => part + Number(person.expenses), 0);

    return (
        <Stack spacing={2}>
            <Box sx={{ overflow: "scroll" }}>
                <TableContainer component={Paper} sx={{ minWidth: 500 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Naam</TableCell>
                                <TableCell>Stand</TableCell>
                                <TableCell>Uitgaven (+)</TableCell>
                                <TableCell>Consumptie (-)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map(person =>
                                <Fragment key={person.id}>
                                    <PersonRow person={person} />
                                </Fragment>
                            )}
                        </TableBody>
                        <TableHead>
                            <TableRow>
                                <TableCell>Totaal</TableCell>
                                <TableCell />
                                <TableCell />
                                <TableCell>{formatEuro(totalExpenses)}</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
            </Box>

            <Box>
                <Typography variant="h5">Terug te betalen:</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {toSettle.map(settlement =>
                                <Fragment key={settlement.from + ',' + settlement.to}>
                                    <TableRow>
                                        <TableCell>
                                            <b>{getPerson(settlement.from)?.name}</b>
                                        </TableCell>
                                        <TableCell>{formatEuro(settlement.amount)}</TableCell>
                                        <TableCell><ArrowForward /></TableCell>
                                        <TableCell>
                                            <b>{getPerson(settlement.to)?.name}</b>
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Stack>
    );
}

function PersonRow({ person }) {
    const balance = person.balance;
    const [{ userId }] = useSettings();

    return (
        <TableRow selected={person.id === userId} hover>
            <TableCell>{person.name}</TableCell>
            <TableCell>
                <Chip label={formatEuro(balance)} color={balance < 0 ? "error" : "success"} />
            </TableCell>
            <TableCell>{formatEuro(person.expenses)}</TableCell>
            <TableCell>{formatEuro(person.consumption)}</TableCell>
        </TableRow>
    );
}
