import { useState } from "react";
import { Paper, TextField } from "@mui/material";
import BrandsList from "./BrandsList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { brandsQueryKey, deleteBrandFn } from "./queries";
import { useConfirm } from "material-ui-confirm";


export default function BrandController({ handleSelectBrand, onClose }) {
    const [searchQuery, setSearchQuery] = useState("");

    const queryClient = useQueryClient();

    const deleteBrandMutation = useMutation({
        mutationFn: deleteBrandFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [brandsQueryKey] });
        },
        onError: (error, variables, context) => {
            console.log(`Error`, error);
        },
    });

    const confirm = useConfirm();

    function handleDelete(brand) {
        console.log("delete brand", brand);

        confirm({ description: `Verwijderen van ${brand.name}` })
            .then(() => {
                deleteBrandMutation.mutate(brand.id)
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
