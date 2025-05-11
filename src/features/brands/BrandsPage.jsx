import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useConfirm } from "material-ui-confirm";

import InfiniteData from "src/components/ui/InfiniteData";
import Page from "src/components/ui/Page";
import { useBrandDeleter, useBrandMutation, useBrands } from "./api";
import { matchesSearch } from "src/utils/search";
import { useSearchParamsSearch } from "src/hooks/useSearchParams";
import DeleteButton from "src/components/ui/DeleteButton";


export function BrandsPage() {
    const { data, isLoading } = useBrands();
    const [search, setSearch] = useSearchParamsSearch();
    const addBrand = useBrandMutation().mutate;
    const deleteBrand = useBrandDeleter().mutate;
    const confirmDelete = useConfirm();

    const brands = data || [];
    const filteredBrands = brands.filter((brand) => matchesSearch(search, brand.name));

    const onAddNewBrand = () => {
        addBrand({ name: search })
    }
    const handleDelete = (brand) => {
        confirmDelete({ description: `Verwijderen van "${brand.name}"` })
            .then(() => {
                deleteBrand(brand.id)
            })
            .catch(() => { });
    }

    return (
        <Page
            title="Merken"
            maxWidth="xs"
            initialSearch={search}
            handleNewSearch={setSearch}
        >
            <InfiniteData
                isLoading={isLoading}
                empty={brands.length === 0}
            >
                <List sx={{ width: 1 }}>
                    {search &&
                        <ListItemButton
                            divider
                            onClick={onAddNewBrand}
                        >
                            <ListItemText>
                                Voeg toe: "{search}"
                            </ListItemText>
                        </ListItemButton>
                    }
                    {filteredBrands.map((brand) =>
                        <ListItem
                            key={brand.id}
                            divider
                            secondaryAction={
                                <DeleteButton
                                    onClick={() => handleDelete(brand)}
                                />
                            }
                        >
                            <ListItemText>
                                {brand.name}
                            </ListItemText>
                        </ListItem>
                    )}
                </List>
            </InfiniteData>
        </Page>
    );
}
