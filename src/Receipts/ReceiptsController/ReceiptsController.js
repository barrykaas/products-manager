import { useState } from "react";
import { Autocomplete, Button, Stack, TextField, Typography } from "@mui/material";

import ReceiptsList from "./ReceiptsList";
import { ReceiptFormDialog } from "../ReceiptForm";
import { useListsInvalidator } from "../../Lists/ListsApiQueries";
import ControllerView from "../../Helpers/ControllerView";
import useUrlSearchQuery from "../../Helpers/urlSearchQuery";
import FormDialog from "../../Helpers/FormDialog";
import { useSearchParams } from "react-router-dom";
import { PersonsIdField } from "../../Persons/PersonsField";
import { MarketIdField } from "../../Markets/MarketField";
import { DateField } from "../../Helpers/DateField";


export default function ReceiptsController({ onMenu }) {
    const [isEditing, setIsEditing] = useState(false);
    const [initialFormData, setInitialFormData] = useState();
    const invalidateReceipts = useListsInvalidator();
    const [searchQuery, setSearchQuery] = useUrlSearchQuery();
    const [filterOpen, setFilterOpen] = useState(false);

    const onAddReceipt = () => {
        setInitialFormData(undefined);
        setIsEditing(true)
    };
    const selectReceipt = (item) => {
        setInitialFormData(item);
        setIsEditing(true);
    };

    const handleSuccessfulCreateEdit = (newReceipt) => {
        setInitialFormData(newReceipt);
    };

    const onRefresh = invalidateReceipts;

    const onCloseForm = () => {
        setIsEditing(false);
        onRefresh();
    };

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

            <ReceiptFormDialog
                open={isEditing}
                onClose={onCloseForm}

                initialValues={initialFormData}
                onSuccessfulCreateEdit={handleSuccessfulCreateEdit}
                onSuccessfulDelete={() => setIsEditing(false)}
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
                <Stack direction="row" spacing={1.5}>
                    <DateField
                        label="Na"
                        clearable
                        value={searchParams.get("transaction_after")}
                        onChange={value => updateParam("transaction_after", value?.toISOString())}
                    />
                    <DateField
                        label="Voor"
                        clearable
                        value={searchParams.get("transaction_before")}
                        onChange={value => updateParam("transaction_before", value?.toISOString())}
                    />
                </Stack>

                <Typography>Datum gecreëerd</Typography>
                <Stack direction="row" spacing={1.5}>
                    <DateField
                        label="Na"
                        clearable
                        value={searchParams.get("created_after")}
                        onChange={value => updateParam("created_after", value?.toISOString())}
                    />
                    <DateField
                        label="Voor"
                        clearable
                        value={searchParams.get("created_before")}
                        onChange={value => updateParam("created_before", value?.toISOString())}
                    />
                </Stack>

            </Stack>
        </FormDialog>
    );
}
