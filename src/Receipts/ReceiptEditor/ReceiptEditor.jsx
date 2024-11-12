import { Fragment, useState } from "react";
import { Box, Checkbox, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import FormDialog from "../../Helpers/FormDialog";
import EventController from "../../Events/EventController";
import DeleteButton from "../../Common/DeleteButton";
import QuickAddBox from "./QuickAddBox";
import ReceiptItemRow from "./ReceiptItemRow";
import ChooseEventButton from "../../Common/ChooseEventButton";
import { formatEuro } from "../../Helpers/monetary";
import { apiLocations, useApiDeleter, useApiMutation } from "../../Api/Common";
import { useReceiptItems } from "../../Api/receipts";


export default function ReceiptEditor({ receiptId }) {
    const receiptItemsQuery = useReceiptItems(receiptId);
    const receiptQuery = useQuery({ queryKey: [apiLocations.receipts, receiptId] });
    const mutateListItem = useApiMutation({
        queryKey: [apiLocations.receipts, receiptId, 'items']
    }).mutate;

    const [selection, setSelection] = useState([]);
    const [currentEvent, setCurrentEvent] = useState();

    const receipt = receiptQuery.data;

    const allItems = [...(receiptItemsQuery?.data || [])].reverse();
    const receiptTotal = allItems.reduce((s, item) => s + Number(item.amount), 0);
    const allItemIds = allItems.map(item => item.id);
    const someChecked = selection.length > 0;
    const onCheckAll = (state) => setSelection(state ? [...allItemIds] : []);

    const handleNewItem = (listItem) => {
        listItem.receipt = receiptId;
        listItem.event = currentEvent;
        mutateListItem(listItem);
    };

    return (
        <TableContainer component={Paper} sx={{ my: 2 }}>
            <Box sx={{ height: '4rem', m: 1 }}>
                {someChecked &&
                    <SelectedActions
                        receiptId={receiptId}
                        selection={selection}
                        clearSelection={() => setSelection([])}
                    />
                }
                {
                    someChecked ||
                    <QuickAddBox
                        handleListItem={handleNewItem}
                        marketId={receipt?.market}
                    />
                }
            </Box>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={someChecked}
                                indeterminate={selection.length < allItemIds.length && someChecked}
                                onChange={(event) => onCheckAll(event.target.checked)}
                            />
                        </TableCell>
                        <TableCell>
                            Aantal
                        </TableCell>
                        <TableCell>
                            Omschrijving
                        </TableCell>
                        <TableCell>
                            Prijs
                        </TableCell>
                        <TableCell>
                            Bedrag
                        </TableCell>
                        <TableCell>
                            Event
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    {allItems.map(item =>
                        <Fragment key={item.id}>
                            <ReceiptItemRow
                                item={item}
                                selected={selection.includes(item.id)}
                                setSelected={(state) => {
                                    const newSelection = [...selection];
                                    if (state) {
                                        newSelection.push(item.id);
                                    } else {
                                        const ind = newSelection.indexOf(item.id);
                                        newSelection.splice(ind, 1);
                                    }
                                    setSelection(newSelection);
                                }}
                                setCurrentEvent={setCurrentEvent}
                            />
                        </Fragment>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3} />
                        <TableCell>
                            <Typography textAlign="end">
                                Totaal
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography >
                                {formatEuro(receiptTotal)}
                            </Typography>
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

function SelectedActions({ receiptId, selection, clearSelection }) {
    const [eventPickerOpen, setEventPickerOpen] = useState(false);
    const deleteListItem = useApiDeleter({
        queryKey: [apiLocations.receipts, receiptId, 'items']
    }).mutate;
    const mutateListItem = useApiMutation({
        queryKey: [apiLocations.receipts, receiptId, 'items']
    }).mutate;

    const onDelete = () => {
        selection.forEach((itemId) => deleteListItem(itemId));
        clearSelection();
    };

    const handleSelectedEvent = (event) => {
        selection.forEach(
            (itemId) => mutateListItem({
                id: itemId,
                event: event.id
            })
        );
        setEventPickerOpen(false);
        clearSelection();
    };

    return (
        <>
            <Stack direction="row" spacing={1} >
                <ChooseEventButton onClick={() => setEventPickerOpen(true)} />

                <DeleteButton onClick={onDelete} />
            </Stack>

            <FormDialog
                hasToolbar={false}
                title={"Kies event"}
                open={eventPickerOpen}
                onClose={() => setEventPickerOpen(false)}
            >
                <EventController
                    handleSelectedEvent={handleSelectedEvent}
                    onClose={() => setEventPickerOpen(false)}
                />
            </FormDialog>
        </>
    );
}
