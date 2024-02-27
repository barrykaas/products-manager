import { useState } from "react";
import { Paper, TextField } from "@mui/material";
import { useConfirm } from "material-ui-confirm";

import BrandsList from "./BrandsList";
import { useBrandDeleter } from "./BrandsApiQueries";
import ControllerView from "../Helpers/ControllerView";


export default function BrandController({ handleSelectBrand, onClose, onMenu }) {
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
        <ControllerView
            title="Merken"
            searchQuery={searchQuery}
            onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
            onMenu={onMenu}
            onClose={onClose}
        >
            <BrandsList searchQuery={searchQuery} handleDelete={handleDelete} />
        </ControllerView>
    );
}
