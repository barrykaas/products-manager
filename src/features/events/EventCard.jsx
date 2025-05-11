import { Person } from "src/components/icons";
import { Skeleton, Stack, Typography } from "@mui/material";

import { isoToRelativeDate } from "../../utils/dateTime";
import { PersonAvatarGroup } from "../persons";
import { formatEuro } from "../../utils/monetary";
import { useSettings } from "../../hooks/useSettings";
import IdLabel from "../../components/ui/IdLabel";
import { usePersons } from "../persons";
import { capitalize } from "../../utils/strings";


export function EventCard({
    event,
    showStats = false,
    hideDate = false,
    ...props
}) {
    const [{ nerdInfo }] = useSettings();

    const listCount = event.list_count;
    const participants = event.participations.map(p => p.participant);
    const amount = Number(event.total);
    const amountPerPerson = participants.length >= 2 ?
        amount / participants.length
        : null;

    const secondaryInfo = [
        listCount === 0 ? null : `${listCount} bonnetje${listCount === 1 ? '' : 's'}`,
    ];

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                width: 1, height: 1,
                alignItems: 'start',
            }}
            {...props}
        >
            <Stack
                alignItems="start"
                sx={{
                    width: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'left'
                }}
            >
                {!hideDate &&
                    <Typography noWrap variant="caption" sx={{ color: 'text.secondary' }}>
                        {isoToRelativeDate(event.date)}
                    </Typography>
                }

                <Typography sx={{ width: 1 }}>
                    {nerdInfo &&
                        <IdLabel id={event.id} />
                    }
                    {event.name || <BackupTitle event={event} />}
                </Typography>
                <PersonAvatarGroup personIds={participants} />
            </Stack>

            {showStats && amount !== 0 &&
                <Stack
                    alignItems="end"
                    sx={{
                        whiteSpace: 'nowrap',
                        align: 'right'
                    }}
                >
                    <Typography>
                        <b>{formatEuro(amount)}</b>
                    </Typography>

                    {amountPerPerson &&
                        <Stack direction="row" alignItems="center" spacing={0.5}
                            sx={{ color: 'text.secondary' }}
                        >
                            <Person fontSize="inherit" />
                            <Typography variant="caption">
                                {formatEuro(amountPerPerson)}
                            </Typography>
                        </Stack>
                    }

                    <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary' }}
                    >
                        {secondaryInfo.filter(Boolean).join(' - ')}
                    </Typography>
                </Stack>
            }
        </Stack>
    );
}


const kaasFood = [1, 2, 4, 5];

function BackupTitle({ event }) {
    const { isLoading, data } = usePersons();
    const persons = data || [];
    const getPerson = (id) => persons.find((p) => p.id === id);

    if (isLoading) return <Skeleton />;

    const participants = event.participations.map(p => p.participant);
    const missing = kaasFood.filter(k => !participants.includes(k));
    const extra = participants.filter(p => !kaasFood.includes(p));

    let str = '';
    if (missing.length) {
        str += 'zonder ' + missing.map(p => getPerson(p).name).join(', ');
        if (extra.length) str += '; ';
    }
    if (extra.length) {
        str += 'met ' + extra.map(p => getPerson(p).name).join(', ');
    }

    return <i>{capitalize(str)}</i>;
}
