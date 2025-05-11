import { Add, ChevronLeft, ChevronRight, Restore } from "src/components/icons";
import { ButtonBase, Divider, IconButton, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import dayjs from "dayjs";

import { endOfWeek, startOfWeek, toLocalISODateString } from "src/utils/dateTime";
import DateDialog from "./DateDialog";


const dayMilliseconds = 86400 * 1000;

export default function WeekCalendar({
    hasDate,
    setHasDate,
    onAdd,
    events,
    renderEvent,
    getEventKey = (e) => e.id,
    onPrevious,
    onNext,
    onResetDate,
    isLoading,
    ...props
}) {
    const [dateDialogOpen, setDateDialogOpen] = useState(false);

    const monday = startOfWeek(hasDate);
    const weekEnd = endOfWeek(hasDate);
    const startDate = monday.toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' });
    const endDate = weekEnd.toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' });
    const weekMs = new Date() - monday;
    const thisWeek = 0 <= weekMs && weekMs < 7 * dayMilliseconds;
    const nowYear = (new Date()).getFullYear();

    return (
        <>
            <Stack
                component={Paper}
                variant="outlined"
                spacing={1}
                {...props}
                sx={[{ m: 1, p: 1 }, props.sx ?? {}]}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <IconButton onClick={onPrevious}>
                        <ChevronLeft />
                    </IconButton>
                    <Stack direction="row" spacing={1}>
                        <Typography
                            component={ButtonBase}
                            onClick={() => setDateDialogOpen(true)}
                            sx={{ p: 0.5 }}
                        >
                            {startDate} - {endDate} {nowYear !== weekEnd.getFullYear() && weekEnd.getFullYear()}
                            {thisWeek && ' (Deze week)'}
                        </Typography>
                        {!thisWeek &&
                            <IconButton onClick={onResetDate}>
                                <Restore />
                            </IconButton>
                        }
                    </Stack>
                    <IconButton onClick={onNext}>
                        <ChevronRight />
                    </IconButton>
                </Stack>

                {/* week {weekNumber} */}
                {[...Array(7).keys()].map((day) =>
                    <>
                        <Divider />
                        <Day
                            key={day}
                            date={new Date(monday.valueOf() + day * dayMilliseconds)}
                            onAdd={onAdd}
                            events={events}
                            renderEvent={renderEvent}
                            getEventKey={getEventKey}
                            isLoading={isLoading}
                        />
                        {/* {day !== 6 && <Divider />} */}
                    </>
                )}
            </Stack>

            <DateDialog
                open={dateDialogOpen}
                onClose={() => setDateDialogOpen(false)}
                value={hasDate}
                setValue={(value) => setHasDate(dayjs(value).format('YYYY-MM-DD'))}
            />
        </>
    );
}

function Day({
    date,
    events,
    onAdd,
    renderEvent,
    getEventKey,
    isLoading,
    ...props
}) {
    const todayEvents = events.filter((event) => {
        const diff = new Date(event.date) - date;
        return 0 <= diff && diff < dayMilliseconds;
    });
    const handleAdd = () => onAdd(toLocalISODateString(date));

    return (
        <Stack
            direction="row"
            spacing={2}
            // component={Paper}
            // variant="outlined"
            // p={1}
            {...props}
        >
            <DateSymbol date={date} onClick={handleAdd} />
            <Stack
                spacing={1}
                sx={{ width: 1 }}
            >
                {!isLoading && todayEvents.map((event) =>
                    <Fragment key={getEventKey(event)}>
                        {renderEvent(event)}
                    </Fragment>
                )}
                {!isLoading && todayEvents.length === 0 &&
                    <Paper
                        variant="outlined"
                        component={ButtonBase}
                        sx={{
                            borderStyle: 'dashed',
                            height: '40px'
                        }}
                        onClick={handleAdd}
                    >
                        <Add />
                    </Paper>
                }
                {isLoading && <Skeleton height='80px' sx={{ p:0}} />}
            </Stack>
        </Stack>
    );
}

function DateSymbol({ date, onClick }) {
    return (
        <Stack
            width="40px"
            // height="60px"
            component={ButtonBase}
            flexShrink={0}
            justifyContent="start"
            onClick={onClick}
        >
            <Typography variant="subtitle2" fontSize={12}>
                {date.toLocaleString('nl-NL', { weekday: 'short' })}
            </Typography>
            <Typography>
                {date.getDate()}
            </Typography>
        </Stack>
    );
}

// function Header({
//     onPrevious,
//     onNext,
//     onClickDate,
//     startDatem
// }) {
//     return (
//     );
// }