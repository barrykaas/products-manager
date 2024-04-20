import { Clear, Search } from "@mui/icons-material";
import { IconButton, Input, InputAdornment } from "@mui/material";
import { useState } from "react";

import useDebounce from "./debounce";


export default function ToolbarSearch({ initialValue = "", handleNewValue }) {
    const [inputValue, setInputValue] = useState(initialValue);

    useDebounce(
        () => handleNewValue(inputValue),
        [inputValue], 250
    );

    const clear = () => {
        setInputValue("");
        handleNewValue("");
    };

    return (
        <Input
            id="standard-search"
            placeholder="Zoek"
            type="search"
            value={inputValue}
            onChange={(e) => {
                const newValue = e.target.value;
                setInputValue(newValue);
            }}
            autoFocus
            startAdornment={
                <InputAdornment position="start">
                    <Search />
                </InputAdornment>
            }
            endAdornment={inputValue &&
                <InputAdornment position="end">
                    <IconButton onClick={clear}>
                        <Clear />
                    </IconButton>
                </InputAdornment>
            }
            sx={{ maxWidth: 0.5 }}
        />
    );
}
