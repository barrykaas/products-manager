import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { productsQueryKey } from '../../Products/ProductsApiQueries';
import { getWords } from '../../Helpers/strings';
import { useQuery } from '@tanstack/react-query';
import { isNumber, roundDigits } from '../../Helpers/numbers';
import { useUnitTypes } from '../../UnitTypes/UnitTypeQueries';
import { formatEuro } from '../../Helpers/monetary';
import { constructListItem, finishListItem } from './ReceiptItem/tools';


export default function QuickAddBox({ handleListItem }) {
    const [inputValue, setInputValue] = useState('');
    const { getUnitType, isLoading, isError } = useUnitTypes();

    const disabled = isLoading || isError;

    const parsedInput = parseInput(inputValue);
    const search = parsedInput.description;

    const productsQuery = useQuery([productsQueryKey, null, { search }],
        { enabled: !!search });
    const products = productsQuery.data?.results || [];

    // Construct list item from parsed input
    const freeformOption = {
        description: parsedInput.description,
        product_price: parsedInput.amount || 0,
        amount: parsedInput.amount || 0,
    };
    if (parsedInput.quantity) {
        freeformOption.description = parsedInput.quantity + ' ' + freeformOption.description;
    }

    // Construct list items from product search
    const productOptions = products.map(apiProduct => {
        const unitType = getUnitType(apiProduct.unit_type);
        const product = {
            discrete: unitType.discrete,
            physical_unit: unitType.physical_unit,
            ...apiProduct
        };
        // todo: annotate in api? ^

        return mergeInputAndProduct(product, parsedInput);
    });

    const options = inputValue ? [freeformOption, ...productOptions] : [];

    return (
        <Autocomplete
            fullWidth
            freeSolo
            disabled={disabled}
            filterOptions={(x) => x}
            value={null}
            onChange={(event, newValue) => {
                handleListItem(newValue);
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
                <li {...props} key={option?.product?.id || -1}>
                    {getOptionLabel(option)}
                </li>
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
    const { product, amount, description } = option;
    const name = product?.name || `"${description}"`;
    const unit = (!product || product.discrete) ? 'x' : product.physical_unit;
    const parts = [];
    if (option.product_quantity) {
        parts.push(option.product_quantity + unit);
    }
    if (option.description || product?.name) {
        parts.push(name);
    }

    parts.push(formatEuro(amount))
    return parts.join(' ');
};


const mergeInputAndProduct = (product, parsedInput) => {
    const option = constructListItem(product);
    if (parsedInput.quantity) {
        let q = parsedInput.quantity;
        if (q < 1) q *= 1000;
        option.product_quantity = q;
    }
    if (parsedInput.amount) option.amount = parsedInput.amount;

    if (parsedInput.quantity && parsedInput.amount) {
        delete option.product_price;
    } else if (parsedInput.quantity) {
        delete option.amount;
    } else if (parsedInput.amount) {
        if (product.discrete) {
            delete option.product_price;
        } else {
            delete option.product_quantity;
        }
    }

    finishListItem(option)
    return option;
};
