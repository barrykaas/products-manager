import { Stack, Typography } from "@mui/material";

import { isoToRelativeDate } from "../Helpers/dateTime";
import { PersonAvatarGroup } from "../Persons/Avatars/Avatars";
import { formatEuro } from "../Helpers/monetary";
import { useSettings } from "../Settings/settings";
import { Person } from "@mui/icons-material";
import IdLabel from "../Common/IdLabel";


export default function EventCard({ event, showStats = false }) {
    const [{ nerdInfo }] = useSettings();

    const listCount = event.lists.length;
    const participants = event.event_participants;
    const amount = event.amount;
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
                    {isoToRelativeDate(event.event_date)}
                </Typography>

                <Typography noWrap sx={{ width: 1 }}>
                    {nerdInfo &&
                        <IdLabel id={event.id} />
                    }
                    {event.name}
                </Typography>
                <PersonAvatarGroup personIds={event.event_participants} />
            </Stack>

            {showStats && amount !== 0 &&
                <Stack alignItems="end" sx={{ whiteSpace: "nowrap" }}>
                    <Typography>
                        <b>{formatEuro(event.amount)}</b>
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
