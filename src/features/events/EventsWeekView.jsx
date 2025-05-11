import { Edit } from "src/components/icons";
import { ButtonBase, IconButton, Paper, Stack } from "@mui/material";

import { usePaginatedEvents } from "./api";
import { useUrlParamState } from "src/hooks/useSearchParams";
import { advanceDays, startOfWeek, toLocalISODateString } from "src/utils/dateTime";
import WeekCalendar from "src/components/ui/WeekCalendar";
import { EventCard } from "./EventCard";


export function EventsWeekView({
    onSelectEvent,
    onEditEvent,
    eventsOptions,
    ...props
}) {
    const [hasDate, setHasDate] = useUrlParamState('hasDate', toLocalISODateString(new Date()), { replace: true })
    const hasDateStart = new Date(hasDate + 'T00:00:00');
    const weekStart = startOfWeek(hasDateStart);
    const weekEnd = new Date(weekStart.valueOf() + (7 * 86400 - 1) * 1000);
    const { data, isLoading } = usePaginatedEvents({
        page_size: 100,
        date_after: weekStart,
        date_before: weekEnd,
        ...eventsOptions
    });
    const events = data ? data.pages.flatMap(page => page.results) : [];
    const onClickWeekday = (date) => {
        const newEvent = { date: new Date(date + 'T00:00:00') };
        console.log('onweekday', onEditEvent)
        if (onEditEvent) {
            onEditEvent(newEvent);
        } else {
            onSelectEvent(newEvent);
        }
    }

    const onNext = () => {
        const newDate = new Date(hasDateStart);
        advanceDays(newDate, 7);
        setHasDate(toLocalISODateString(newDate));
    }

    const onPrevious = () => {
        const newDate = new Date(hasDateStart);
        advanceDays(newDate, -7);
        setHasDate(toLocalISODateString(newDate));
    }

    return (
        <WeekCalendar
            isLoading={isLoading}
            hasDate={hasDateStart}
            setHasDate={setHasDate}
            events={events}
            renderEvent={(event) => renderEvent(
                event,
                onSelectEvent,
                onEditEvent
            )}
            onNext={onNext}
            onPrevious={onPrevious}
            onAdd={onClickWeekday}
            onResetDate={() => setHasDate(toLocalISODateString(new Date()), { replace: false })}
            {...props}
        />
    );
}


const renderEvent = (event, onClick, onEdit) => (
    <Stack
        component={Paper}
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{pr: onEdit ? 1 : undefined}}
    >
        <EventCard
            event={event}
            p={1}
            hideDate
            showStats
            component={ButtonBase}
            onClick={() => onClick(event)}
        />
        {onEdit &&
            <IconButton
                onClick={() => onEdit(event)}
            >
                <Edit />
            </IconButton>
        }
    </Stack>
    // <Paper
    //     component={ButtonBase}
    //     onClick={() => onClick(event)}
    // >
    //     <EventCard event={event} p={1} hideDate showStats />
    // </Paper>
);
