import { ListItemButton, IconButton, ListSubheader, Paper, ListItem } from "@mui/material";
import { Fragment } from "react";
import EditIcon from '@mui/icons-material/Edit';

import { useEvents } from "./EventsApiQueries";
import InfiniteList from "../Helpers/InfiniteList";
import { isoToRelativeDate, weeksAhead } from "../Helpers/dateTime";
import { Link, useSearchParams } from "react-router-dom";
import { removeEmpty } from "../Helpers/objects";
import EventCard from "./EventCard";


export function EventsListItem({ item, onEdit, onSelect, linkTo, ...props }) {
    const secondaryAction = onEdit ?
        <IconButton aria-label="comment" onClick={onEdit}>
            <EditIcon />
        </IconButton>
        : null;

    const name = item.name;
    const listCount = item.lists.length;
    const participants = item.event_participants;
    const amount = item.amount;
    const amountPerPerson = participants.length >= 2 ?
        amount / participants.length
        : null;

    const secondaryInfo = [
        isoToRelativeDate(item.event_date),
        listCount === 0 ? null : `${listCount} lijst${listCount === 1 ? '' : 'en'}`,
    ];

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

export default function EventsList({ handleEditEvent, handleSelectedEvent, getLinkTo = defaultLinkTo, searchQuery, ItemProps }) {
    const [searchParams] = useSearchParams();
    const {
        data,
        isFetching,
        hasNextPage,
        isFetchingNextPage,
        isError,
        error,
        fetchNextPage
    } = useEvents({
        params: {
            search: searchQuery,
            ...searchParamsToApi(searchParams)
        }
    });

    if (typeof ItemProps !== 'function') {
        ItemProps = () => ItemProps;
    }

    // TODO: fix subheaders
    const allEvents = data?.pages.flatMap((page) => page.results) || [];
    const groupedEvents = allEvents.reduce((grouped, event) => {
        const weeks = weeksAhead(event.event_date);
        let id;
        if (!event.event_date) {
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

function searchParamsToApi(params) {
    const apiParams = {
        ordering: params.get('ordering'),

        event_date__lte: params.get('event_before'),
        event_date__gte: params.get('event_after'),

        date_created__lte: params.get('created_before'),
        date_created__gte: params.get('created_after'),

        participants_include: params.get('participants_include'),
        participants_exclude: params.get('participants_exclude'),
    };

    return removeEmpty(apiParams);
}
