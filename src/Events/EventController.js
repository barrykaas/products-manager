import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

import EventsList from './EventsList';
import { EventFormDialog } from './EventForm';
import { useEventsInvalidator } from './EventsApiQueries';
import ControllerView from '../Helpers/ControllerView';
import useLocalSearchParams from '../Helpers/localSearchParams';
import FilterDialog from '../Helpers/FilterDialog'


const defaultTitle = "Events";

const filterOptions = [
    {
        type: 'ordering',
        param: 'ordering',
        options: {
            date: 'Datum',
            date_created: 'Datum gecreëerd',
            list_count: 'Aantal bonnetjes/lijsten',
            'total,id': 'Totaalbedrag',
        }
    },
    {
        label: 'Datum',
        type: 'daterange',
        param: 'date',
    },
    {
        label: 'Datum gecreëerd',
        type: 'daterange',
        param: 'created',
    },
    {
        label: 'Inclusief deelnemers',
        type: 'persons',
        param: 'participants',
    },
    {
        label: 'Exclusief deelnemers',
        type: 'persons',
        param: 'participants_not',
    },
    {
        label: 'Georganiseerd door',
        type: 'persons',
        param: 'organizers',
    },
];


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
                options={filterOptions}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
        </>
    );
}
