import { Chip, CircularProgress, Paper, Table, TableCell, TableContainer, TableHead, TableRow, Box } from "@mui/material";
import { usePersons } from "../Persons/PersonsApiQueries";
import { formatEuro } from "../Helpers/monetary";

function PersonRow({ person }) {
    const balance = person.expenses - person.consumption;

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
    const { isError, error, isLoading, data } = usePersons();

    if (isLoading) {
        return <CircularProgress />;
    }
    if (isError) {
        return <div>Error: {JSON.stringify(error)}</div>;
    }

    return (
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
    );
}
