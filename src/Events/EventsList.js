import { ListItemButton, IconButton, ListSubheader, Paper, ListItem } from "@mui/material";
import { Fragment } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";

import InfiniteList from "../Helpers/InfiniteList";
import { weeksAhead } from "../Helpers/dateTime";
import EventCard from "./EventCard";
import { apiLocations, usePaginatedQuery } from "../Api/Common";
import { searchParamsToObject } from "../Helpers/searchParams";
import { partition } from "../Helpers/arrays";


export function EventsListItem({ item, onEdit, onSelect, linkTo, ...props }) {
    const secondaryAction = onEdit ?
        <IconButton aria-label="comment" onClick={onEdit}>
            <EditIcon />
        </IconButton>
        : null;

    return (
        <ListItem
            secondaryAction={secondaryAction}
            disablePadding
            divider
            sx={{ width: 1 }}
        >
            <ListItemButton
                onClick={onSelect}
                component={Link}
                to={!!onSelect || linkTo || `/events/${item.id}`}
                {...props}
            >
                <EventCard
                    event={item}
                    showStats
                />
            </ListItemButton>
        </ListItem>
    );
}

const defaultLinkTo = (event) => `/events/${event.id}`;

export default function EventsList({ handleEditEvent, handleSelectedEvent, getLinkTo = defaultLinkTo, searchParams, ItemProps }) {
    const {
        data,
        isFetching,
        hasNextPage,
        isFetchingNextPage,
        isError,
        error,
        fetchNextPage
    } = usePaginatedQuery({
        queryKey: [
            apiLocations.events,
            searchParamsToObject(searchParams)
        ]
    });

    if (typeof ItemProps !== 'function') {
        ItemProps = () => ItemProps;
    }

    const allEvents = data?.pages.flatMap((page) => page.results) || [];
    const groupedEvents = partition(
        allEvents,
        (eventA, eventB) => timePeriod(eventA.date) === timePeriod(eventB.date)
    );

    return (
        <InfiniteList onMore={fetchNextPage} hasMore={hasNextPage}
            isLoading={isFetching || isFetchingNextPage}
            error={isError ? error : null}
            subheader={<li />}
            sx={{ width: 1 }}
        >
            {groupedEvents.map(events =>
                <Fragment key={`section-${events[0].id}`}>
                    <ListSubheader disableSticky component={Paper} >
                        {timePeriod(events[0].date)}
                    </ListSubheader>
                    {events.map(event =>
                        <Fragment key={event.id}>
                            <EventsListItem item={event}
                                onSelect={handleSelectedEvent && (() => handleSelectedEvent(event))}
                                onEdit={handleEditEvent && (() => handleEditEvent(event))}
                                linkTo={!handleSelectedEvent && getLinkTo(event)}
                            />
                        </Fragment>
                    )}
                </Fragment>
            )}
        </InfiniteList>
    );
};

function timePeriod(date) {
    const weeks = weeksAhead(date);
    let id;
    if (!date) {
        id = "Geen datum";
    } else if (weeks > 2) {
        id = "Over meer dan twee weken";
    } else if (weeks === 2) {
        id = "Over twee weken";
    } else if (weeks === 1) {
        id = "Volgende week";
    } else if (weeks === 0) {
        id = "Deze week";
    } else if (weeks === -1) {
        id = "Vorige week";
    } else if (weeks === -2) {
        id = "Twee weken geleden";
    } else if (weeks < -2) {
        id = "Meer dan twee weken geleden";
    }
    return id;
}
