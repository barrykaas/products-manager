import { ListItemText, ListItemButton, IconButton, Stack, Typography, ListSubheader, Paper, ListItem } from "@mui/material";
import { Fragment } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { Person } from "@mui/icons-material";

import { useEvents } from "./EventsApiQueries";
import InfiniteList from "../Helpers/InfiniteList";
import { formatEuro } from "../Helpers/monetary";
import { isoToRelativeDate, weeksAhead } from "../Helpers/dateTime";
import { PersonAvatarGroup } from "../Persons/Avatars/Avatars";
import { useSearchParams } from "react-router-dom";
import { removeEmpty } from "../Helpers/objects";


function EventsListItem({ item, onEdit, onSelect }) {
    const secondaryAction = (onSelect && onEdit) ?
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
            alignItems="flex-start"
        >
            <ListItemButton onClick={onSelect}>
                <Stack alignItems="flex-start" width={1}
                    sx={{ pr: onEdit ? 2 : "none" }}
                >
                    <ListItemText
                        sx={{ width: 1 }}
                        primary={
                            <Stack direction="row" justifyContent="space-between" spacing={1}>
                                <Typography>{name}</Typography>
                                {amount !== 0 &&
                                    <Typography align="right" sx={{ whiteSpace: "nowrap" }}>
                                        <b>{formatEuro(amount)}</b>
                                    </Typography>
                                }
                            </Stack>
                        }
                        secondaryTypographyProps={{ component: "div" }}
                        secondary={
                            <Stack direction="row" justifyContent="space-between" spacing={1}>
                                {secondaryInfo.filter(Boolean).join("  -  ")}
                                {amount !== 0 && amountPerPerson &&
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <Person fontSize="inherit" />
                                        <Typography variant="inherit" align="right" sx={{ whiteSpace: "nowrap" }}>
                                            {formatEuro(amountPerPerson)}
                                        </Typography>
                                    </Stack>
                                }
                            </Stack>
                        }
                    />
                    <PersonAvatarGroup personIds={participants} />
                </Stack>
            </ListItemButton>
        </ListItem>
    );
}

export default function EventsList({ handleEditEvent, handleSelectedEvent, searchQuery }) {
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
                                    onEdit={handleEditEvent && (() => handleEditEvent(item))} />
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
    };

    return removeEmpty(apiParams);
}
