import React, { useState } from 'react';
import { Alert, Button, Snackbar, Stack, Autocomplete, TextField, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import EventsList from './EventsList';
import { EventFormDialog } from './EventForm';
import { useEventsInvalidator } from './EventsApiQueries';
import ControllerView from '../Helpers/ControllerView';
import useUrlSearchQuery from '../Helpers/urlSearchQuery';
import { DateRangeField } from '../Helpers/DateField';
import FormDialog from '../Helpers/FormDialog';


const defaultTitle = "Events";

export default function EventController({ handleSelectedEvent, onClose, onMenu, title = defaultTitle } = {}) {
    const [formOpen, setFormOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    const [messageOpen, setMessageOpen] = useState(false);

    const [messageText, setMessageText] = useState("");
    const [messageState, setMessageState] = useState(true);

    const [searchQuery, setSearchQuery] = useUrlSearchQuery();
    const [filterOpen, setFilterOpen] = useState(false);

    const invalidateEvents = useEventsInvalidator();

    let handleAddEvent = 'new';
    if (handleSelectedEvent) {
        handleAddEvent = () => {
            setCurrentEvent({});
            setFormOpen(true);
        };
    }

    const handleEditEvent = (event) => {
        setFormOpen(true);
        setCurrentEvent(event);
    };

    const onSuccessfulCreateEdit = () => {
        setFormOpen(false);
        setMessageText("Gelukt!");
        setMessageState("success");
        setMessageOpen(true);
    };

    const onRefresh = invalidateEvents;

    const showEditButtons = Boolean(handleSelectedEvent);

    return (
        <>
            <Snackbar open={messageOpen} autoHideDuration={1500} onClose={() => setMessageOpen(false)}>
                <Alert severity={messageState ? "success" : "error"} sx={{ width: '100%' }}>
                    {messageText}
                </Alert>
            </Snackbar>

            <ControllerView
                onClose={onClose}
                title={title}
                onRefresh={onRefresh}
                onAdd={handleAddEvent}
                onFilter={() => setFilterOpen(true)}
                onMenu={onMenu}
                initialSearch={searchQuery}
                handleNewSearch={setSearchQuery}
            >
                <EventsList
                    handleEditEvent={showEditButtons && handleEditEvent}
                    handleSelectedEvent={handleSelectedEvent}
                    searchQuery={searchQuery}
                />
            </ControllerView>

            <EventFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                initialValues={currentEvent}
                onSuccessfulCreateEdit={onSuccessfulCreateEdit}
            />

            <FilterDialog
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
            />
        </>
    );
}


const allFilterParams = [
    "ordering",
    "event_before",
    "event_after",
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
                <Autocomplete
                    id="ordering"
                    autoHighlight
                    value={searchParams.get("ordering")}
                    onChange={(event, newValue, reason) => updateParam("ordering", newValue)}
                    isOptionEqualToValue={(option, value) => option === value}
                    getOptionLabel={(option) => option}
                    options={[
                        "-event_date",
                        "event_date",
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

                <Typography>Datum van het event</Typography>
                <DateRangeField
                    clearable
                    valueAfter={searchParams.get("event_after")}
                    onChangeAfter={value => updateParam("event_after", value?.toISOString())}
                    valueBefore={searchParams.get("event_before")}
                    onChangeBefore={value => updateParam("event_before", value?.toISOString())}
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
