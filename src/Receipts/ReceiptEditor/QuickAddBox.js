import { Fragment, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getWords } from '../../Helpers/strings';
import { isInteger, isNumber, roundDigits } from '../../Helpers/numbers';
import { formatEuro } from '../../Helpers/monetary';
import { apiLocations } from '../../Api/Common';
import { BrandLabel } from './ReceiptItemRow';
import { productQuantityDescription } from '../../Helpers/productQuantity';


export default function QuickAddBox({ handleListItem, marketId }) {
    const [inputValue, setInputValue] = useState('');
    const parsedInput = parseInput(inputValue);
    const search = parsedInput.description;
    const productsQuery = useQuery([apiLocations.products, { search, market: marketId }],
        { enabled: !!search });
    const products = productsQuery.data?.results || [];

    // Construct list item from parsed input
    const freeformOption = {
        quantity: parsedInput.quantity || 1,
        description: parsedInput.description,
        price: (parsedInput.amount || 0) / (parsedInput.quantity || 1),
    };
    // Construct list items from product search
    const productOptions = products.map(product =>
        mergeInputAndProduct(product, parsedInput)
    );

    const onSelect = (option) => {
        const listItem = { ...option };
        if (option.product) {
            listItem.product = option.product.id;
        }
        console.log("SELECTED", listItem)
        handleListItem(listItem);
    };

    const options = inputValue ? [freeformOption, ...productOptions] : [];

    return (
        <Autocomplete
            fullWidth
            freeSolo
            filterOptions={(x) => x}
            value={null}
            onChange={(event, newValue) => {
                onSelect(newValue);
                setInputValue('');
            }}
            inputValue={inputValue}
            onInputChange={(event, newValue) => {
                setInputValue(newValue);
            }}
            selectOnFocus
            autoHighlight
            clearOnBlur
            handleHomeEndKeys
            options={options}
            getOptionLabel={getOptionLabel}
            renderOption={(props, option) =>
                <Fragment key={option?.product?.id || -1}>
                    <RenderOption props={props} option={option} />
                </Fragment>
            }
            renderInput={(params) => (
                <TextField {...params}
                    label="Voeg toe..."
                    placeholder="3 volle melk 3.12"
                />
            )}
        />
    );
}

function parseInput(input) {
    const parsed = {};

    const words = getWords(input);
    if (words.length === 1) {
        const amount = Number(input);
        if (isNumber(amount)) {
            parsed.amount = amount;
            if (amount < 0) parsed.description = "Korting";
        } else {
            parsed.description = input;
        }
    } else if (words.length === 2) {
        const [first, last] = words;
        if (isNumber(last)) {
            parsed.description = first;
            parsed.amount = Number(last);
        } else if (isNumber(first)) {
            parsed.quantity = Number(first);
            parsed.description = last;
        } else {
            parsed.description = input;
        }
    } else if (words.length >= 3) {
        if (isNumber(words[0])) {
            parsed.quantity = Number(words.shift());
        }
        if (isNumber(words[words.length - 1])) {
            parsed.amount = Number(words.pop());
        }
        parsed.description = words.join(' ');
    }

    if (parsed.amount) parsed.amount = roundDigits(parsed.amount, 2);
    if (parsed.quantity) parsed.quantity = roundDigits(parsed.quantity, 3);
    return parsed;
}


const getOptionLabel = (option) => {
    const { product, quantity, price, description } = option;
    const name = product?.name || `"${description}"`;
    const unit = (!product || product.unit_type.discrete) ? 'x' : product.unit_type.physical_unit;
    const amount = quantity * price;
    const parts = [
        quantity + unit
    ];
    if (option.description || product?.name) {
        parts.push(name);
    }

    parts.push(formatEuro(amount))
    return parts.join(' ');
};


const mergeInputAndProduct = (product, parsedInput) => {
    const option = { product };
    if (product.unit_type.discrete) {
        let q = parsedInput.quantity || 1;
        q = roundDigits(q, 3);
        option.quantity = q;
        let p = parsedInput.amount ? parsedInput.amount / q : product.price;
        option.price = roundDigits(p, 2);

    } else {
        let q = parsedInput.quantity || product.volume / 1000;
        if (isInteger(parsedInput.quantity)) q /= 1000;
        q = roundDigits(q, 3);
        option.quantity = q;
        let p = parsedInput.amount ? parsedInput.amount / q : product.unit_price;
        option.price = roundDigits(p, 2);
    }
    return option;
};


function RenderOption({ props = {}, option }) {
    const product = option?.product;
    const unit = (!product || product.unit_type.discrete) ? 'x' : product.unit_type.physical_unit;
    const amount = option.quantity * option.price;

    return <li {...props} key={option?.product?.id || -1}>
        <Stack direction="row" alignItems="center" spacing={2} width={1}>
            {option.quantity &&
                <Typography width="50px">{option.quantity + unit}</Typography>
            }

            {option?.product ?
                <ProductLabel product={option.product} />
                : <Typography>"{option?.description}"</Typography>
            }

            <Box flexGrow={1} />
            <Typography sx={{ whiteSpace: "nowrap" }}>
                {formatEuro(amount)}
            </Typography>
        </Stack>
    </li>;
}

function ProductLabel({ product }) {
    return <Stack width={1}>
        <BrandLabel
            brandId={product?.brand}
            variant="subtitle2"
            color="text.secondary"
        />
        <Grid container spacing={1} alignItems="end">
            <Grid item>

                <Typography>{product.name}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="subtitle2" color="text.secondary">
                    {productQuantityDescription(product)}
                </Typography>
            </Grid>
        </Grid>
    </Stack>;
}
