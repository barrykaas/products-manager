import { useState } from "react";
import { Paper, TextField } from "@mui/material";
import BrandsList from "./BrandsList";


export default function BrandController({ handleSelectBrand, onClose }) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <>
            <Paper sx={{ m: 1, p: 1 }}>
                <TextField
                    id="standard-search"
                    label="Zoek"
                    type="search"
                    variant="standard"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                />
            </Paper>

            <BrandsList searchQuery={searchQuery} />
        </>
    );
}
