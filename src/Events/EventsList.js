import { ListItemButton, IconButton, ListSubheader, Paper, ListItem } from "@mui/material";
import { Fragment } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";

import InfiniteList from "../Helpers/InfiniteList";
import { weeksAhead } from "../Helpers/dateTime";
import EventCard from "./EventCard";
import { apiLocations, usePaginatedQuery } from "../Api/Common";
import { searchParamsToObject } from "../Helpers/searchParams";


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

    // TODO: fix subheaders
    const allEvents = data?.pages.flatMap((page) => page.results) || [];
    const groupedEvents = allEvents.reduce((grouped, event) => {
        const weeks = weeksAhead(event.date);
        let id;
        if (!event.date) {
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
        if (grouped[id]) {
            grouped[id].push(event);
        } else {
            grouped[id] = [event];
        }
        return grouped;
    }, {});

    return (
        <InfiniteList onMore={fetchNextPage} hasMore={hasNextPage}
            isLoading={isFetching || isFetchingNextPage}
            error={isError ? error : null}
            ListProps={{ subheader: (<li />) }}
        >
            {Object.keys(groupedEvents).map((period, index) => (
                <li key={`section-${index}`}>
                    <ul>
                        <ListSubheader disableSticky component={Paper}>{period}</ListSubheader>
                        {groupedEvents[period].map((item) => (
                            <Fragment key={item.id}>
                                <EventsListItem item={item}
                                    onSelect={handleSelectedEvent && (() => handleSelectedEvent(item))}
                                    onEdit={handleEditEvent && (() => handleEditEvent(item))}
                                    linkTo={!handleSelectedEvent && getLinkTo(item)}
                                />
                            </Fragment>
                        ))}
                    </ul>
                </li>
            ))}
        </InfiniteList>
    );
};
