import { IconButton, Input, InputAdornment } from "@mui/material";
import { useState } from "react";

import useDebounce from "src/hooks/useDebounce";
import { Clear, FilterList, Search } from "src/components/icons";


export default function SearchBar({
    initialSearch,
    handleNewSearch,
    onFilter,
    filterActive,
    ...props
}) {
    const [inputValue, setInputValue] = useState(initialSearch || '');

    useDebounce(
        () => handleNewSearch(inputValue),
        [inputValue], 250
    );

    const clear = () => {
        setInputValue("");
        handleNewSearch("");
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
            fullWidth
            startAdornment={
                <InputAdornment position="start">
                    <Search />
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position="end">
                    {inputValue &&
                        <IconButton onClick={clear}>
                            <Clear />
                        </IconButton>
                    }
                    {onFilter &&
                        <IconButton
                            onClick={onFilter}
                            color={filterActive && 'primary'}
                        >
                            <FilterList />
                        </IconButton>
                    }
                </InputAdornment>
            }
            {...props}
        />
    );
}
