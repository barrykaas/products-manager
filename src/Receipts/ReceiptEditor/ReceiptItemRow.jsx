import { useState } from "react";
import { Box, Checkbox, Icon, IconButton, InputAdornment, Skeleton, Stack, TableCell, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { AddCircle, FindReplace, RemoveCircle } from "@mui/icons-material";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { listItemsQueryKey, useListItemMutator } from "../../Lists/ListsApiQueries";
import { roundDigits } from "../../Helpers/numbers";
import useUnitTypeInfo from "../../UnitTypes/UnitTypeInfo";
import { eventsQueryKey } from "../../Events/EventsApiQueries";
import FormDialog from "../../Helpers/FormDialog";
import EventController from "../../Events/EventController";
import DeleteButton from "../../Common/DeleteButton";
import CurrencyField from "../../Common/CurrencyField";
import ChooseEventButton from "../../Common/ChooseEventButton";
import { useBrands } from "../../Brands/BrandsApiQueries";
import ProductTooltip from "../../Products/ProductTooltip";
import { ProductFormDialog } from "../../Products/ProductsForm";
import ProductPicker from "../../Products/ProductPicker";
import { constructListItem, finishListItem } from "./tools";
import { useSettings } from "../../Settings/settings";
import IdLabel from "../../Common/IdLabel";
import EventCard from "../../Events/EventCard";


export default function ReceiptItemRow({ item, selected, setSelected, setCurrentEvent }) {
    const [{ nerdInfo }] = useSettings();
    const mutateListItem = useListItemMutator();
    const { unitTypeInfo } = useUnitTypeInfo();
    const discrete = !item.product || unitTypeInfo(item.product.unit_type)?.discrete;
    const [hover, setHover] = useState(false);

    const setPrice = (price) => mutateListItem({
        id: item.id,
        product_price: price / (discrete ? 1 : 1000)
    });
    const setAmount = (amount) => {
        const q = item.product_quantity || 1;
        mutateListItem({
            id: item.id,
            product_quantity: q,
            product_price: amount / q
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
                            <ProductInfo product={item.product} />
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
                    value={item.product_price * (discrete ? 1 : 1000)}
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
    const { isError, isLoading, unitTypeInfo } = useUnitTypeInfo();
    if (isLoading) {
        return "Loading";
    } else if (isError) {
        return "ERROR";
    } else if (!item.product || unitTypeInfo(item.product.unit_type)?.discrete) {
        return <DiscreteQuantityField item={item} showButtons={showButtons} />;
    } else {
        return <ScalarQuantityField item={item} />;
    }
}

function ReceiptItemDescription({ item }) {
    const [descriptionField, setDescriptionField] = useState(item.description || '');
    const mutateListItem = useListItemMutator({
        onSuccess: (data) => setDescriptionField(data.description)
    });

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
    const mutateListItem = useListItemMutator();
    const [input, setInput] = useState(item?.product_quantity / 1000);

    const onBlur = () => mutateListItem({
        id: item.id,
        product_quantity: roundDigits(Number(input) * 1000, 0)
    }, {
        onSuccess: (data) => setInput(data.product_quantity / 1000)
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
    const mutateListItem = useListItemMutator();
    const [input, setInput] = useState(item?.product_quantity);

    const onBlur = () => mutateListItem({
        id: item.id,
        product_quantity: Number(input)
    });

    const disabledDecrease = item.product_quantity <= 1;
    const decreaseQuantity = () => mutateListItem({
        id: item.id,
        product_quantity: item.product_quantity - 1
    }, {
        onSuccess: (data) => setInput(data.product_quantity)
    });
    const increaseQuantity = () => mutateListItem({
        id: item.id,
        product_quantity: (item.product_quantity || 1) + 1
    }, {
        onSuccess: (data) => setInput(data.product_quantity)
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
    const eventQuery = useQuery({ queryKey: [eventsQueryKey, receiptItem.event], enabled: !!receiptItem.event });
    const event = eventQuery.data;
    const [hover, setHover] = useState(false);
    const [eventPickerOpen, setEventPickerOpen] = useState(false);
    const mutateListItem = useListItemMutator();

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
                <EventCard event={event} onDelete={() => console.log('del')} />
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
                title={"Selecteer event"}
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

function ProductInfo({ product }) {
    const brandsQuery = useBrands();
    const brandName = brandsQuery.getBrand(product.brand)?.name;
    const [editorOpen, setEditorOpen] = useState(false);
    const queryClient = useQueryClient();
    const invalidateListItems = () => queryClient.invalidateQueries([listItemsQueryKey]);

    const isLoading = brandsQuery.isLoading;
    const isError = brandsQuery.isError;

    if (isLoading || isError) {
        return <Skeleton />
    }

    return (
        <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
            <Stack alignItems="flex-start" onClick={() => setEditorOpen(true)}>
                {brandName &&
                    <Typography variant="subtitle2" color="text.secondary">
                        {brandName}
                    </Typography>
                }
                <ProductTooltip product={product}>
                    <Typography>
                        {product.name}
                    </Typography>
                </ProductTooltip>
            </Stack>

            <ProductFormDialog
                initialValues={product}
                open={editorOpen}
                onClose={() => setEditorOpen(false)}
                onSuccessfulCreateEdit={() => {
                    invalidateListItems();
                    setEditorOpen(false);
                }}
            />
        </Stack>
    );
}

function ReplaceProductButton({ listItem }) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const updateListItem = useListItemMutator({
        onSuccess: () => setPickerOpen(false)
    });
    const hasProduct = Boolean(listItem?.product);

    const onClick = () => setPickerOpen(true);

    const handleNewProduct = (product) => updateListItem({
        id: listItem.id,
        product_id: product.id
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
