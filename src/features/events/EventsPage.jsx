import { useState } from "react";
import { Tab, Tabs } from "@mui/material";

import Page from "src/components/ui/Page";
import { usePaginatedEvents } from "./api";
import useSearchParams, { useSearchParamsSearch, useUrlParamState } from "src/hooks/useSearchParams";
import TabPanel from "src/components/ui/TabPanel";
import { EventFormDialog } from "./EventForm";
import { EventsList } from "./EventsList";
import InfiniteData from "src/components/ui/InfiniteData";
import FilterChips from "src/components/ui/FilterChips";
import { useSettings } from "src/hooks/useSettings";
import FilterDialog from "src/components/ui/FilterDialog";
import { searchParamsToObject } from "src/utils/searchParams";
import { EventsWeekView } from "./EventsWeekView";


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

export function EventsPage({ onSelectEvent, ...props }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [{ userId }] = useSettings();
    const [search, setSearch] = useSearchParamsSearch();
    const [currentTab, setCurrentTab] = useUrlParamState('view', 'week', { replace: true });
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorInitial, setEditorInitial] = useState({});
    const [filterOpen, setFilterOpen] = useState(false);

    const handleTabChange = (event, newValue) => setCurrentTab(newValue);
    const editEvent = (event) => {
        setEditorInitial(event);
        setEditorOpen(true);
    }
    const onAdd = () => {
        const newEvent = {};
        if (currentTab === 'general') newEvent.date = null;
        editEvent(newEvent);
    }

    let onEditEvent = editEvent;

    if (!onSelectEvent) {
        onSelectEvent = editEvent;
        onEditEvent = undefined;
    }

    const quickFilters = [
        {
            label: 'Met mij',
            state: searchParams.get('participants') == userId,
            toggle: (state) => {
                if (state) {
                    searchParams.delete('participants');
                } else {
                    searchParams.set('participants', userId);
                }
                setSearchParams(searchParams, { replace: true });
            }
        }
    ];

    return (
        <>
            <Page
                title="Events"
                initialSearch={search}
                handleNewSearch={setSearch}
                onFilter={() => setFilterOpen(true)}
                onAdd={onAdd}
                maxWidth="sm"
                appBarSecondary={<FilterChips filters={quickFilters} />}
                {...props}
            >
                {search &&
                    <ListView
                        onSelectEvent={editEvent}
                        eventsOptions={searchParamsToObject(searchParams)}
                    />
                }
                {!search &&
                    <>
                        <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
                            <Tab label="Algemeen" value="general" />
                            <Tab label="Week" value="week" />
                            <Tab label="Lijst" value="list" />
                        </Tabs>
                        <TabPanel index="general" value={currentTab}>
                            <GeneralView
                                onSelectEvent={onSelectEvent}
                                onEditEvent={onEditEvent}
                                eventsOptions={searchParamsToObject(searchParams)}
                            />
                        </TabPanel>
                        <TabPanel index="week" value={currentTab}>
                            <EventsWeekView
                                onSelectEvent={onSelectEvent}
                                onEditEvent={onEditEvent}
                                eventsOptions={searchParamsToObject(searchParams)}
                            />
                        </TabPanel>
                        <TabPanel index="list" value={currentTab}>
                            <ListView
                                onSelectEvent={onSelectEvent}
                                onEditEvent={onEditEvent}
                                eventsOptions={searchParamsToObject(searchParams)}
                            />
                        </TabPanel>
                    </>
                }
            </Page>

            <EventFormDialog
                open={editorOpen}
                onClose={() => setEditorOpen(false)}
                onSuccessfulCreateEdit={() => setEditorOpen(false)}
                onSuccessfulDelete={() => setEditorOpen(false)}
                initialValues={editorInitial}
            />

            <FilterDialog
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                options={filterOptions}
            />
        </>
    );
}


function GeneralView({ onSelectEvent, eventsOptions }) {
    const {
        data,
        isLoading,
        hasNextPage,
        fetchNextPage
    } = usePaginatedEvents({
        general: true,
        page_size: 20,
        ...eventsOptions
    })
    const events = data ? data.pages.flatMap((page) => page.results) : [];

    return (
        <InfiniteData
            hasMore={hasNextPage}
            onMore={fetchNextPage}
            isLoading={isLoading}
            empty={events.length === 0}
            emptyMessage="Geen algemene events"
        >
            <EventsList
                sx={{ width: 1 }}
                events={events}
                onSelect={onSelectEvent}
            />
        </InfiniteData >
    );
}

function ListView({ onSelectEvent, eventsOptions }) {
    const {
        data,
        isLoading,
        hasNextPage,
        fetchNextPage
    } = usePaginatedEvents({
        general: false,
        ...eventsOptions
    })
    const events = data ? data.pages.flatMap((page) => page.results) : [];

    return (
        <InfiniteData
            hasMore={hasNextPage}
            onMore={fetchNextPage}
            isLoading={isLoading}
            empty={events.length === 0}
            emptyMessage="Geen events"
        >
            <EventsList
                sx={{ width: 1 }}
                events={events}
                onSelect={onSelectEvent}
            />
        </InfiniteData >
    );
}
