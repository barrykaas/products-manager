import React, { useState } from 'react';
import { Alert, Button, Snackbar, Stack, Autocomplete, TextField, Typography, Paper } from '@mui/material';

import EventsList from './EventsList';
import { EventFormDialog } from './EventForm';
import { useEventsInvalidator } from './EventsApiQueries';
import ControllerView from '../Helpers/ControllerView';
import { DateRangeField } from '../Helpers/DateField';
import FormDialog from '../Helpers/FormDialog';
import SelectPersons from '../Persons/SelectPersons';
import useLocalSearchParams from '../Helpers/localSearchParams';


const defaultTitle = "Events";

export default function EventController({ handleSelectedEvent, onClose, onMenu, title = defaultTitle } = {}) {
    const [formOpen, setFormOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    const [messageOpen, setMessageOpen] = useState(false);

    const [messageText, setMessageText] = useState("");
    const [messageState, setMessageState] = useState(true);
    const isMainView = !onClose;
    const [searchParams, setSearchParams] = useLocalSearchParams(!isMainView);

    const [filterOpen, setFilterOpen] = useState(false);

    const invalidateEvents = useEventsInvalidator();

    const handleNewSearch = (newSearch) => {
        if (newSearch) {
            searchParams.set('search', newSearch);
        } else {
            searchParams.delete('search')
        }
        setSearchParams(searchParams);
    };

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
                initialSearch={searchParams.get('search') || ''}
                handleNewSearch={handleNewSearch}
            >
                <EventsList
                    handleEditEvent={showEditButtons && handleEditEvent}
                    handleSelectedEvent={handleSelectedEvent}
                    searchParams={searchParams}
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
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
        </>
    );
}


const allFilterParams = [
    "ordering",
    "date_before",
    "date_after",
    "created_before",
    "created_after",
    "modified_before",
    "modified_after",
    "participants",
    "participants_not",
];

function FilterDialog({ open, onClose, searchParams, setSearchParams }) {
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
                    valueAfter={searchParams.get("date_after")}
                    onChangeAfter={value => updateParam("date_after", value?.toISOString())}
                    valueBefore={searchParams.get("date_before")}
                    onChangeBefore={value => updateParam("date_before", value?.toISOString())}
                />

                <Typography>Datum gecreëerd</Typography>
                <DateRangeField
                    clearable
                    valueAfter={searchParams.get("created_after")}
                    onChangeAfter={value => updateParam("created_after", value?.toISOString())}
                    valueBefore={searchParams.get("created_before")}
                    onChangeBefore={value => updateParam("created_before", value?.toISOString())}
                />

                <Typography>Inclusief deelnemers</Typography>
                <Paper variant="outlined">
                    <SelectPersons
                        selected={searchParams.get('participants')?.split(',')?.map(Number) || []}
                        setSelected={newSelected => updateParam('participants', newSelected.sort().join(','))}
                    />
                </Paper>

                <Typography>Exclusief deelnemers</Typography>
                <Paper variant="outlined">
                    <SelectPersons
                        selected={searchParams.get('participants_not')?.split(',')?.map(Number) || []}
                        setSelected={newSelected => updateParam('participants_not', newSelected.sort().join(','))}
                    />
                </Paper>
            </Stack>
        </FormDialog>
    );
}
