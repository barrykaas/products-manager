import { useState } from "react";
import { Autocomplete, Button, Stack, TextField, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import ReceiptsList from "./ReceiptsList";
import { useListsInvalidator } from "../../Lists/ListsApiQueries";
import ControllerView from "../../Helpers/ControllerView";
import useUrlSearchQuery from "../../Helpers/urlSearchQuery";
import FormDialog from "../../Helpers/FormDialog";
import { PersonsIdField } from "../../Persons/PersonsField";
import { MarketIdField } from "../../Markets/MarketField";
import { DateRangeField } from "../../Helpers/DateField";


export default function ReceiptsController({ onMenu }) {
    const invalidateReceipts = useListsInvalidator();
    const [searchQuery, setSearchQuery] = useUrlSearchQuery();
    const [filterOpen, setFilterOpen] = useState(false);

    const onAddReceipt = 'new';

    // Link to receipt editor
    const selectReceipt = (item) => `${item.id}`;

    const onRefresh = invalidateReceipts;

    return (
        <ControllerView
            title="Bonnetjes"
            onRefresh={onRefresh}
            onAdd={onAddReceipt}
            onMenu={onMenu}
            onFilter={() => setFilterOpen(true)}
            initialSearch={searchQuery}
            handleNewSearch={setSearchQuery}
        >
            <ReceiptsList
                onSelectItem={selectReceipt}
                searchQuery={searchQuery}
            />

            <FilterDialog
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
            />
        </ControllerView>
    );
}


const allFilterParams = [
    "payer",
    "market",
    "event",
    "ordering",
    "transaction_before",
    "transaction_after",
    "created_before",
    "created_after",
];

function FilterDialog({ open, onClose }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateParam = (key, value) => {
        if (!value && value !== 0) {
            searchParams.delete(key);
        } else {
            searchParams.set(key, value);
        }
        setSearchParams(searchParams);
    };

    const onReset = () => {
        for (const param of allFilterParams) {
            searchParams.delete(param);
        }
        setSearchParams(searchParams);
    };

    return (
        <FormDialog
            open={open}
            title="Filter"
            onClose={onClose}
            secondaryButtons={
                <Button variant="contained" onClick={onReset}>
                    Reset
                </Button>
            }
        >
            <Stack component="form" p={2} spacing={1.5}
                sx={{ bgcolor: 'background.paper' }}
            >
                <PersonsIdField
                    label="Betaler"
                    value={Number(searchParams.get("payer"))}
                    setValue={value => updateParam("payer", value)}
                />

                <MarketIdField
                    value={Number(searchParams.get("market"))}
                    setValue={value => updateParam("market", value)}
                />

                <Autocomplete
                    id="ordering"
                    autoHighlight
                    value={searchParams.get("ordering")}
                    onChange={(event, newValue, reason) => updateParam("ordering", newValue)}
                    isOptionEqualToValue={(option, value) => option === value}
                    getOptionLabel={(option) => option}
                    options={[
                        "-transaction_date",
                        "transaction_date",
                        "-date_created",
                        "date_created",
                    ]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Sorteer op"
                            fullWidth
                        />
                    )}
                />

                <Typography>Transactiedatum</Typography>
                <DateRangeField
                    clearable
                    valueAfter={searchParams.get("transaction_after")}
                    onChangeAfter={value => updateParam("transaction_after", value?.toISOString())}
                    valueBefore={searchParams.get("transaction_before")}
                    onChangeBefore={value => updateParam("transaction_before", value?.toISOString())}
                />

                <Typography>Datum gecreëerd</Typography>
                <DateRangeField
                    clearable
                    valueAfter={searchParams.get("created_after")}
                    onChangeAfter={value => updateParam("created_after", value?.toISOString())}
                    valueBefore={searchParams.get("created_before")}
                    onChangeBefore={value => updateParam("created_before", value?.toISOString())}
                />

            </Stack>
        </FormDialog>
    );
}
