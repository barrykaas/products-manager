import { Clear, Search } from "@mui/icons-material";
import { IconButton, Input, InputAdornment } from "@mui/material";
import { useState } from "react";


export default function ToolbarSearch({ initialValue = "", handleNewValue }) {
    const [searchQuery, setSearchQuery] = useState(initialValue);

    const clear = () => {
        setSearchQuery("");
        handleNewValue("");
    };

    return (
        <Input
            id="standard-search"
            placeholder="Zoek"
            type="search"
            value={searchQuery}
            onChange={(e) => {
                const newValue = e.target.value;
                setSearchQuery(newValue);
                handleNewValue(newValue);
            }}
            autoFocus
            startAdornment={
                <InputAdornment>
                    <Search />
                </InputAdornment>
            }
            endAdornment={searchQuery &&
                <InputAdornment>
                    <IconButton onClick={clear}>
                        <Clear />
                    </IconButton>
                </InputAdornment>
            }
            sx={{ maxWidth: 0.5 }}
        />
    );
}
