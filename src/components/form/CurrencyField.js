import { InputAdornment, TextField } from "@mui/material";

import { isNumber } from "../../utils/numbers";
import { formatPrice } from "../../utils/monetary";


export default function CurrencyField({ value, setValue, ...props }) {
    const onBlur = () => setValue(formatIfPrice(value));

    return (
        <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            onFocus={(e) => e.target.select()}
            InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>
            }}
            {...props}
        />
    );
}

function formatIfPrice(value) {
    if (isNumber(value)) {
        return formatPrice(value);
    } else {
        return value;
    }
}
