import { Fragment, useState } from "react";
import { Box, Checkbox, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { listsQueryKey, useListItemDeleter, useListItemMutator, useListItems } from "../../Lists/ListsApiQueries";
import FormDialog from "../../Helpers/FormDialog";
import EventController from "../../Events/EventController";
import DeleteButton from "../../Common/DeleteButton";
import QuickAddBox from "./QuickAddBox";
import ReceiptItemRow from "./ReceiptItemRow";
import ChooseEventButton from "../../Common/ChooseEventButton";


export default function ReceiptEditor({ receiptId }) {
    const receiptItemsQuery = useListItems({ listId: receiptId });
    const receiptQuery = useQuery({ queryKey: [listsQueryKey, receiptId] });
    const mutateListItem = useListItemMutator();

    const [selectedItems, setSelectedItems] = useState(new Set());
    const [currentEvent, setCurrentEvent] = useState();


    const allItems = [...(receiptItemsQuery?.data || [])].reverse();
    const allItemIds = new Set(allItems.map(item => item.id));
    // const allChecked = setEqual(allItemIds, selectedItems);
    const someChecked = selectedItems.size > 0;
    const onCheckAll = (state) => {
        state ? setSelectedItems(new Set([...allItemIds]))
            : setSelectedItems(new Set())
    };

    const handleNewItem = (listItem) => {
        listItem.list = receiptId;
        listItem.event = currentEvent;
        mutateListItem(listItem);
    };

    return (
        <TableContainer component={Paper} sx={{ my: 2 }}>
            <Box sx={{ height: '4rem', m: 1 }}>
                {someChecked &&
                    <SelectedActions
                        receiptId={receiptId}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                    />
                }
                {
                    someChecked ||
                    <QuickAddBox
                        handleListItem={handleNewItem}
                        market={receiptQuery.data?.market}
                    />
                }
            </Box>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={someChecked}
                                indeterminate={selectedItems.size < allItemIds.size && someChecked}
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
                                selected={selectedItems.has(item.id)}
                                setSelected={(state) => {
                                    const newSet = new Set([...selectedItems]);
                                    if (state) {
                                        newSet.add(item.id);
                                    } else {
                                        newSet.delete(item.id);
                                    }
                                    setSelectedItems(allItemIds.intersection(
                                        newSet
                                    ));
                                }}
                                setCurrentEvent={setCurrentEvent}
                            />
                        </Fragment>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function SelectedActions({ selectedItems, setSelectedItems }) {
    const [eventPickerOpen, setEventPickerOpen] = useState(false);
    const deleteListItem = useListItemDeleter();
    const mutateListItem = useListItemMutator();

    const onDelete = () => {
        selectedItems.forEach((itemId) => deleteListItem(itemId));
        setSelectedItems(new Set());
    };

    const handleSelectedEvent = (event) => selectedItems.forEach(
        (itemId) => mutateListItem({
            id: itemId,
            event: event.id
        }, {
            onSuccess: () => setEventPickerOpen(false)
        })
    );

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
