import { Skeleton, Stack, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";

import { isoToRelativeDate } from "../Helpers/dateTime";
import { PersonAvatarGroup } from "../Persons/Avatars/Avatars";
import { formatEuro } from "../Helpers/monetary";
import { useSettings } from "../Settings/settings";
import IdLabel from "../Common/IdLabel";
import { usePersons } from "../Persons/PersonsApiQueries";
import { capitalize } from "../Helpers/strings";


export default function EventCard({ event, showStats = false }) {
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
        >
            <Stack
                alignItems="start"
                sx={{
                    width: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >
                <Typography noWrap variant="caption" sx={{ color: 'text.secondary' }}>
                    {isoToRelativeDate(event.date)}
                </Typography>

                <Typography noWrap sx={{ width: 1 }}>
                    {nerdInfo &&
                        <IdLabel id={event.id} />
                    }
                    {event.name || <BackupTitle event={event} />}
                </Typography>
                <PersonAvatarGroup personIds={participants} />
            </Stack>

            {showStats && amount !== 0 &&
                <Stack alignItems="end" sx={{ whiteSpace: "nowrap" }}>
                    <Typography>
                        <b>{formatEuro(amount)}</b>
                    </Typography>

                    {amountPerPerson &&
                        <Stack direction="row" alignItems="center" spacing={0.5}
                            sx={{ color: 'text.secondary' }}
                        >
                            <Person fontSize="inherit" />
                            <Typography
                                variant="caption"
                                align="right"
                            >
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
    const { isLoading, getPerson } = usePersons();

    if (isLoading) return <Skeleton />;

    const participants = event.participations.map(p => p.participant);
    const missing = kaasFood.filter(k => !participants.includes(k));
    const extra = participants.filter(p => !kaasFood.includes(p));

    let str = '';
    if (missing.length) {
        console.log('missing')
        str += 'zonder ' + missing.map(p => getPerson(p).name).join(', ');
        if (extra.length) str += '; ';
    }
    if (extra.length) {
        str += 'met ' + extra.map(p => getPerson(p).name).join(', ');
    }

    return <i>{capitalize(str)}</i>;
}
