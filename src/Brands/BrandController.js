import { useState } from "react";
import { Paper, TextField } from "@mui/material";
import { useConfirm } from "material-ui-confirm";

import BrandsList from "./BrandsList";
import { useBrandDeleter } from "./BrandsApiQueries";


export default function BrandController({ handleSelectBrand, onClose }) {
    const [searchQuery, setSearchQuery] = useState("");

    const deleteBrand = useBrandDeleter({
        onSuccess: () => console.log("Brand deleted"),
        onError: (error, variables, context) => console.log(`Error deleting brand:`, error)
    });

    const confirm = useConfirm();

    function handleDelete(brand) {
        console.log("delete brand", brand);

        confirm({
            title: "Weet je zeker dat je dit merk wilt verwijderen?",
            description: `${brand.name}`
        })
            .then(() => {
                deleteBrand(brand.id);
            })
            .catch(() => {
                
            });
    }

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

            <BrandsList searchQuery={searchQuery} handleDelete={handleDelete} />
        </>
    );
}
