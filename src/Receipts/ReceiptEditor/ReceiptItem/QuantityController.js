import { InputAdornment, Stack, TextField, Typography, IconButton } from "@mui/material";
import { Close, AddCircle, RemoveCircle } from "@mui/icons-material";
import { useState } from "react";

import { moveToFront } from "../../../Helpers/arrays";
import { formatPrice } from "../../../Helpers/monetary";
import useUnitTypeInfo from "../../../UnitTypes/UnitTypeInfo";
import { useListItemMutator } from "../../../Lists/ListsApiQueries";


const Equals = () => <Typography variant="h4">=</Typography>;

function formatWeight(weight) {
    return Number(weight).toFixed(3);
}

export default function QuantityController({ listItem }) {
    const product = listItem.product;

    const { unitTypeInfo } = useUnitTypeInfo();
    const unitType = unitTypeInfo(product.unit_type);

    if (unitType.discrete) {
        return <DiscreteQuantityController item={listItem} />;
    } else {
        return <ScalarQuantityController item={listItem} />;
    }
}

function DiscreteQuantityController({ item }) {
    const mutateListItem = useListItemMutator();
    const [quantityField, setQuantityField] = useState(item.product_quantity);
    const [unitPriceField, setUnitPriceField] = useState(formatPrice(item.product_price));
    const [amountField, setAmountField] = useState(
        formatPrice(item.product_quantity * item.product_price)
    );
    const [recentField, setRecentField] = useState("unitPrice");

    // Quantity handlers
    const increaseQuantity = () => {
        const newQuantity = item.product_quantity + 1;
        setQuantityField(newQuantity);
        let unitPrice = unitPriceField;
        if (recentField === "unitPrice") {
            setAmountField(formatPrice(newQuantity * unitPriceField));
        } else {
            unitPrice = amountField / newQuantity;
            setUnitPriceField(formatPrice(unitPrice));
        }
        mutateListItem({
            id: item.id,
            product_quantity: newQuantity,
            product_price: unitPrice
        });
    }

    const disabledDecrease = (item.product_quantity <= 1)
    const decreaseQuantity = () => {
        const newQuantity = item.product_quantity - 1;
        setQuantityField(newQuantity);
        let unitPrice = unitPriceField;
        if (recentField === "unitPrice") {
            setAmountField(formatPrice(newQuantity * unitPriceField));
        } else {
            unitPrice = amountField / newQuantity;
            setUnitPriceField(formatPrice(unitPrice));
        }
        mutateListItem({
            id: item.id,
            product_quantity: newQuantity,
            product_price: unitPrice
        });
    }

    const onBlurQuantity = (event) => {
        const newQuantity = event.target.value;
        setQuantityField(newQuantity);
        let unitPrice = unitPriceField;
        if (recentField === "unitPrice") {
            setAmountField(formatPrice(newQuantity * unitPriceField));
        } else {
            unitPrice = amountField / newQuantity;
            setUnitPriceField(formatPrice(unitPrice));
        }
        mutateListItem({
            id: item.id,
            product_quantity: newQuantity,
            product_price: unitPrice
        });
    };

    // Unit price handlers
    const onBlurUnitPrice = (event) => {
        setRecentField("unitPrice");
        setUnitPriceField(formatPrice(unitPriceField));
        const newPrice = event.target.value;
        setAmountField(formatPrice(quantityField * newPrice));
        mutateListItem({
            id: item.id,
            product_price: newPrice
        });
    };

    // Amount handlers
    const onBlurAmount = (event) => {
        setRecentField("amount");
        setAmountField(formatPrice(amountField))
        const newAmount = event.target.value;
        const newUnitPrice = newAmount / quantityField;
        setUnitPriceField(formatPrice(newUnitPrice));
        mutateListItem({
            id: item.id,
            product_price: newUnitPrice
        });
    };


    return (
        <Stack
            sx={{ pl: 2, pr: 0 }}
            direction="row" alignItems="center" justifyContent="space-between"
        >
            <TextField
                value={quantityField}
                onChange={(e) => setQuantityField(e.target.value)}
                onBlur={onBlurQuantity}
                onFocus={(event) => event.target.select()}
                sx={{ width: '100px' }}
                label="Aantal"
                variant="standard"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    startAdornment:
                        <IconButton
                            onClick={decreaseQuantity}
                            disabled={disabledDecrease}
                        >
                            <RemoveCircle />
                        </IconButton>,
                    endAdornment:
                        <IconButton onClick={increaseQuantity}>
                            <AddCircle />
                        </IconButton>,
                    disableUnderline: true
                }}
            />

            <Close />

            <TextField
                value={unitPriceField}
                onChange={(e) => setUnitPriceField(e.target.value)}
                onBlur={onBlurUnitPrice}
                onFocus={(event) => event.target.select()}
                sx={{ width: '60px' }}
                label="Per stuk"
                variant="standard"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    disableUnderline: true,
                    startAdornment: <InputAdornment position="start">€</InputAdornment>
                }}
            />

            <Equals />

            <TextField
                value={amountField}
                onChange={(e) => setAmountField(e.target.value)}
                onBlur={onBlurAmount}
                onFocus={(event) => event.target.select()}
                sx={{ width: '80px' }}
                label="Bedrag"
                variant="standard"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    disableUnderline: true,
                    startAdornment: <InputAdornment position="start">€</InputAdornment>
                }}
            />
        </Stack>
    )
}

function ScalarQuantityController({ item }) {
    const mutateListItem = useListItemMutator();
    const [quantityField, setQuantityField] = useState(
        formatWeight(item.product_quantity / 1000));
    const [unitPriceField, setUnitPriceField] = useState(
        formatPrice(item.product_price * 1000));
    const [amountField, setAmountField] = useState(
        formatPrice(item.product_quantity * item.product_price)
    );
    const [recentFields, setRecentFields] = useState(["unitPrice", "quantity", "amount"]);
    const setMostRecent = (field) => {
        const newOrder = moveToFront(recentFields, field);
        setRecentFields(newOrder);
        return newOrder[newOrder.length - 1];
    };

    // Quantity handlers
    const onBlurQuantity = (event) => {
        const oldestField = setMostRecent("quantity");
        const newQuantity = Number(event.target.value);
        setQuantityField(newQuantity.toFixed(3));
        let unitPrice = unitPriceField;
        if (oldestField === "unitPrice") {
            unitPrice = amountField / newQuantity;
            setUnitPriceField(formatPrice(unitPrice));
        } else { // amount
            setAmountField(formatPrice(newQuantity * unitPriceField));
        }
        mutateListItem({
            id: item.id,
            product_quantity: newQuantity * 1000,
            product_price: unitPrice / 1000
        });
    };

    // Unit price handlers
    const onBlurUnitPrice = (event) => {
        const oldestField = setMostRecent("unitPrice");
        const newUnitPrice = event.target.value;
        setUnitPriceField(formatPrice(newUnitPrice));
        let quantity = quantityField;
        if (oldestField === "quantity") {
            quantity = amountField / newUnitPrice;
            setQuantityField(quantity);
        } else { // amount
            setAmountField(formatPrice(quantity * newUnitPrice));
        }
        mutateListItem({
            id: item.id,
            product_quantity: quantity * 1000,
            product_price: newUnitPrice / 1000
        });
    };

    // Amount handlers
    const onBlurAmount = (event) => {
        const oldestField = setMostRecent("amount");
        const newAmount = event.target.value;
        setAmountField(formatPrice(newAmount));
        let quantity = quantityField;
        let unitPrice = unitPriceField
        if (oldestField === "quantity") {
            quantity = Math.round(newAmount / unitPrice * 1000) / 1000;
            setQuantityField(quantity);
        } else { // unitPrice
            unitPrice = newAmount / quantity;
            setUnitPriceField(formatPrice(unitPrice));
        }
        mutateListItem({
            id: item.id,
            product_quantity: quantity * 1000,
            product_price: unitPrice / 1000
        });
    };


    return (
        <Stack
            sx={{ pl: 2, pr: 0 }}
            direction="row" alignItems="center" justifyContent="space-between"
        >
            <TextField
                value={quantityField}
                onChange={(e) => setQuantityField(e.target.value)}
                onBlur={onBlurQuantity}
                onFocus={(event) => event.target.select()}
                sx={{ width: '80px' }}
                label="Gewicht"
                variant="standard"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    disableUnderline: true
                }}
            />

            <Close />

            <TextField
                value={unitPriceField}
                onChange={(e) => setUnitPriceField(e.target.value)}
                onBlur={onBlurUnitPrice}
                onFocus={(event) => event.target.select()}
                sx={{ width: '60px' }}
                label="Per kg"
                variant="standard"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    disableUnderline: true,
                    startAdornment: <InputAdornment position="start">€</InputAdornment>
                }}
            />

            <Typography variant="h4">=</Typography>

            <TextField
                value={amountField}
                onChange={(e) => setAmountField(e.target.value)}
                onBlur={onBlurAmount}
                onFocus={(event) => event.target.select()}
                sx={{ width: '80px' }}
                label="Bedrag"
                variant="standard"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    disableUnderline: true,
                    startAdornment: <InputAdornment position="start">€</InputAdornment>
                }}
            />
        </Stack>
    )
}
