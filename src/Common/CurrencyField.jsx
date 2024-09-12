import { useState } from "react";
import { InputAdornment, TextField } from "@mui/material";

import { formatPrice } from "../Helpers/monetary";
import { roundDigits } from "../Helpers/numbers";


export default function CurrencyField({ value, setValue, ...props }) {
    const [inputValue, setInputValue] = useState(formatPrice(value));
    const [focused, setFocused] = useState(false);

    const onBlur = () => {
        setInputValue(formatPrice(inputValue));
        setValue(roundDigits(Number(inputValue), 2));
        setFocused(false);
    };

    return (
        <TextField
            value={focused ? inputValue : formatPrice(value)}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={onBlur}
            onFocus={(event) => {
                setInputValue(formatPrice(value));
                setFocused(true);
                event.target.select();
            }}
            InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>
            }}
            {...props}
        />
    );
}
