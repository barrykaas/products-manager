import { useState } from "react";
import { Box, Checkbox, Icon, IconButton, InputAdornment, Skeleton, Stack, TableCell, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { AddCircle, FindReplace, RemoveCircle } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

import { roundDigits } from "../../Helpers/numbers";
import FormDialog from "../../Helpers/FormDialog";
import EventController from "../../Events/EventController";
import DeleteButton from "../../Common/DeleteButton";
import CurrencyField from "../../Common/CurrencyField";
import ChooseEventButton from "../../Common/ChooseEventButton";
import ProductTooltip from "../../Products/ProductTooltip";
import { ProductFormDialog } from "../../Products/ProductsForm";
import ProductPicker from "../../Products/ProductPicker";
import { useSettings } from "../../Settings/settings";
import IdLabel from "../../Common/IdLabel";
import EventCard from "../../Events/EventCard";
import { apiLocations, useApiMutation } from "../../Api/Common";
import { useReceiptItemMutation } from "../api";
import ProductCard from "../../Products/ProductCard";


export default function ReceiptItemRow({ item, selected, setSelected, setCurrentEvent }) {
    const [{ nerdInfo }] = useSettings();
    const receiptId = item.list;
    const mutateListItem = useApiMutation({
        queryKey: [apiLocations.receipts, receiptId, 'items']
    }).mutate;
    const [hover, setHover] = useState(false);

    const setPrice = (price) => mutateListItem({
        id: item.id,
        price
    });
    const setAmount = (amount) => {
        const q = item.quantity || 1;
        mutateListItem({
            id: item.id,
            price: amount / q
        });
    };

    return (
        <TableRow
            selected={selected}
            hover
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <TableCell
                onClick={() => setSelected(!selected)}
                padding="checkbox"
            >
                <Checkbox
                    sx={{ display: (selected || hover) ? 'inline' : 'none' }}
                    checked={selected}
                    onChange={(event) => setSelected(event.target.checked)}
                />
                {nerdInfo && <IdLabel id={item.id} />}
            </TableCell>
            <TableCell>
                <QuantityField item={item} showButtons={hover} />
            </TableCell>
            <TableCell width="300px">
                <Stack direction="row" alignItems="center">
                    <Box sx={{ width: 1 }}>
                        {item?.product ?
                            <ProductInfo productId={item.product} />
                            : <ReceiptItemDescription item={item} />
                        }
                    </Box>
                    {hover ?
                        <ReplaceProductButton listItem={item} />
                        : <Icon />
                    }
                </Stack>
            </TableCell>
            <TableCell sx={{ minWidth: '8rem' }}>
                <CurrencyField
                    value={item.price}
                    setValue={setPrice}
                    size="small"
                />
            </TableCell>
            <TableCell sx={{ minWidth: '8rem' }}>
                <CurrencyField
                    value={item.amount} setValue={setAmount}
                    size="small"
                />
            </TableCell>
            <TableCell sx={{ minWidth: '10rem' }}>
                <EventPicker receiptItem={item} setCurrentEvent={setCurrentEvent} showText={hover} />
            </TableCell>
        </TableRow>
    );
}

function QuantityField({ item, showButtons }) {
    const { isError, isLoading, data } = useQuery({
        queryKey: [apiLocations.products, item.product],
        enabled: !!item.product
    });

    if (item.product && isLoading) {
        return "Loading";
    } else if (isError) {
        return "ERROR";
    } else if (item.product && !data.unit_type.discrete) {
        return <ScalarQuantityField item={item} />;
    } else {
        return <DiscreteQuantityField item={item} showButtons={showButtons} />;
    }
}

function ReceiptItemDescription({ item }) {
    const [descriptionField, setDescriptionField] = useState(item.description || '');
    const mutateListItem = useApiMutation({
        queryKey: [apiLocations.receipts, item.id, 'items'],
        onSuccess: (data) => setDescriptionField(data.description)
    }).mutate;

    const onBlur = () => mutateListItem({
        id: item.id,
        description: descriptionField
    });

    return (
        <TextField
            variant="standard"
            value={descriptionField}
            onChange={(event) => setDescriptionField(event.target.value)}
            placeholder="Omschrijving"
            onBlur={onBlur}
        />
    );
}

function ScalarQuantityField({ item }) {
    const mutateListItem = useApiMutation({
        queryKey: [apiLocations.receipts, item.list, 'items']
    }).mutate;
    const [input, setInput] = useState(item.quantity);

    const onBlur = () => mutateListItem({
        id: item.id,
        quantity: roundDigits(Number(input), 3)
    }, {
        onSuccess: (data) => setInput(data.quantity)
    });

    return (
        <TextField
            sx={{ width: '6rem' }}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onBlur={onBlur}
            onFocus={(event) => event.target.select()}
            placeholder="1"
            size="small"
            InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                disableUnderline: true
            }}
        />
    );
}

function DiscreteQuantityField({ item, showButtons }) {
    const mutateListItem = useApiMutation({
        queryKey: [apiLocations.receipts, item.list, 'items']
    }).mutate;
    const [input, setInput] = useState(Number(item.quantity));

    const onBlur = () => mutateListItem({
        id: item.id,
        quantity: Number(input)
    });

    const disabledDecrease = item.quantity <= 1;
    const decreaseQuantity = () => mutateListItem({
        id: item.id,
        quantity: Number(item.quantity) - 1
    }, {
        onSuccess: (data) => setInput(String(Number(data.quantity)))
    });
    const increaseQuantity = () => mutateListItem({
        id: item.id,
        quantity: Number(item.quantity || 1) + 1
    }, {
        onSuccess: (data) => setInput(String(Number(data.quantity)))
    });

    return (
        <TextField
            sx={{ width: 100 }}
            variant="standard"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onBlur={onBlur}
            onFocus={(event) => event.target.select()}
            placeholder="1"
            InputProps={{
                startAdornment:
                    <IconButton
                        onClick={decreaseQuantity}
                        disabled={disabledDecrease || !showButtons}
                    >
                        {showButtons ?
                            <RemoveCircle />
                            : <Icon />
                        }
                    </IconButton>,
                endAdornment:
                    <IconButton
                        onClick={increaseQuantity}
                        disabled={!showButtons}
                    >
                        {showButtons ?
                            <AddCircle />
                            : <Icon />
                        }
                    </IconButton>,
                disableUnderline: true
            }}
        />
    );
}

function EventPicker({ receiptItem, setCurrentEvent, showText = true }) {
    const eventQuery = useQuery({ queryKey: [apiLocations.events, receiptItem.event], enabled: !!receiptItem.event });
    const event = eventQuery.data;
    const [hover, setHover] = useState(false);
    const [eventPickerOpen, setEventPickerOpen] = useState(false);
    const mutateListItem = useApiMutation({
        queryKey: [apiLocations.receipts, receiptItem.list, 'items']
    }).mutate;

    const handleSelectedEvent = (event) => mutateListItem({
        id: receiptItem.id,
        event: event.id
    }, {
        onSuccess: (data) => {
            setEventPickerOpen(false);
            setCurrentEvent(data.event);
        }
    });

    const onDelete = () => mutateListItem({
        id: receiptItem.id,
        event: null
    });

    let content;
    if (!receiptItem.event) {
        if (showText) {
            content = <ChooseEventButton onClick={() => setEventPickerOpen(true)} />;
        }
    } else if (eventQuery.isLoading) {
        return <div>Loading event...</div>;
    } else if (eventQuery.isError) {
        return <div>Error loading event</div>;
    } else {
        content = (
            <Box onClick={() => setEventPickerOpen(true)}>
                <EventCard event={event} />
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{ width: "10rem", position: 'relative', display: "" }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {content}

                {receiptItem.event &&
                    <DeleteButton
                        onClick={onDelete}
                        sx={{ position: 'absolute', top: 0, right: 0 }}
                        visible={hover}
                    />
                }
            </Box>
            <FormDialog
                hasToolbar={false}
                open={eventPickerOpen}
                onClose={() => setEventPickerOpen(false)}
            >
                <EventController
                    handleSelectedEvent={handleSelectedEvent}
                    title="Kies event"
                    onClose={() => setEventPickerOpen(false)}
                />
            </FormDialog>
        </>
    );
}

function ProductInfo({ productId }) {
    const { isLoading, isError, error, data } = useQuery({
        queryKey: [apiLocations.products, productId]
    });
    const product = data;

    const [editorOpen, setEditorOpen] = useState(false);

    if (isError) return <div>Error: {JSON.stringify(error)}</div>;

    return (
        <>
            <ProductCard
                productId={productId}
                onClick={() => setEditorOpen(true)}
            />

            <ProductFormDialog
                initialValues={product}
                open={editorOpen}
                onClose={() => setEditorOpen(false)}
                onSuccessfulCreateEdit={() => setEditorOpen(false)}
            />
        </>
    );
}

function ReplaceProductButton({ listItem }) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const updateListItem = useReceiptItemMutation({
        queryKey: [apiLocations.receipts, listItem.list, 'items'],
        onSuccess: () => setPickerOpen(false)
    }).mutate;
    const hasProduct = Boolean(listItem?.product);

    const onClick = () => setPickerOpen(true);

    const handleNewProduct = (product) => updateListItem({
        id: listItem.id,
        product: product.id
    });

    const tooltip = hasProduct ? "Kies ander product" : "Koppel een product";

    return (
        <>
            <Tooltip title={tooltip}>
                <IconButton onClick={onClick}>
                    <FindReplace />
                </IconButton>
            </Tooltip>

            <ProductPicker
                handleSelectedProduct={handleNewProduct}
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
            />
        </>
    );
}
