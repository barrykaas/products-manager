import { Search } from "@mui/icons-material";
import { Input, InputAdornment } from "@mui/material";


export default function ToolbarSearch({ searchQuery, onChange }) {
    return (
        <Input
            id="standard-search"
            placeholder="Zoek"
            type="search"
            variant="standard"
            value={searchQuery}
            onChange={onChange}
            autoFocus
            startAdornment={
                <InputAdornment>
                    <Search />
                </InputAdornment>
            }
            sx={{ maxWidth: 0.5 }}
        />
    );
}
