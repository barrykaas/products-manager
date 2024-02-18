import { Chip, CircularProgress, Paper, Table, TableCell, TableContainer, TableHead, TableRow, Box, Button, Stack, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

import { formatEuro } from "../Helpers/monetary";
import { useBalances } from "./BalanceApiQueries";


function PersonRow({ person }) {
    const balance = person.balance;

    return (
        <TableRow>
            <TableCell>{person.name}</TableCell>
            <TableCell>
                <Chip label={formatEuro(balance)} color={balance < 0 ? "error" : "success"} />
            </TableCell>
            <TableCell>{formatEuro(person.expenses)}</TableCell>
            <TableCell>{formatEuro(person.consumption)}</TableCell>
        </TableRow>
    );
}

export default function BalanceInfo() {
    const { isError, error, isLoading, data, getPerson, invalidate } = useBalances();


    if (isLoading) {
        return <CircularProgress />;
    }
    if (isError) {
        return <div>Error: {JSON.stringify(error)}</div>;
    }

    const onRefresh = invalidate;
    const toSettle = data.flatMap(person => person?.to_settle ?? [])

    return (
        <Stack spacing={2}>
            <Button onClick={onRefresh}>Refresh</Button>

            <Box sx={{ overflow: "scroll" }}>
                <TableContainer component={Paper} sx={{ minWidth: 500 }}>
                    <Table>
                        <TableHead>
                            <TableCell>Naam</TableCell>
                            <TableCell>Stand</TableCell>
                            <TableCell>Uitgaven (+)</TableCell>
                            <TableCell>Consumptie (-)</TableCell>
                        </TableHead>
                        {data.map(person => PersonRow({ person }))}
                    </Table>
                </TableContainer>
            </Box>

            <Box>
                <Typography variant="h5">Terug te betalen:</Typography>
                <TableContainer>
                    {toSettle.map(settlement =>
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
                    )}
                </TableContainer>
            </Box>
        </Stack>
    );
}
