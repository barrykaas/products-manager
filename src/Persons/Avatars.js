import { Avatar, AvatarGroup, Grid, Stack, Tooltip } from "@mui/material";

import { usePersons } from "./PersonsApiQueries";
import { green, grey, red, orange, blue } from "@mui/material/colors";

const defaultSize = 30;

const kaasColors = {
    "Rutger": grey[300],
    "Julian": green[500],
    "Thijmen": red[500],
    "Jelle": blue[500],
    "Cas": orange[300],
}

export default function PersonAvatar({ personId, size = defaultSize }) {
    const { isLoading, isError, getPerson } = usePersons();

    if (!personId) return null;

    let initials;
    if (isLoading) {
        initials = '...';
    } else if (isError) {
        initials = '!';
    }

    let color = null;
    const person = getPerson(personId);
    if (person) {
        initials = person.name.slice(0, 2);
        color = kaasColors[person.name];
    }

    return (
        <Tooltip arrow title={person?.name ?? `ID ${personId}`}>
            <Avatar
                sx={{ height: size, width: size, bgcolor: color }}
            >{initials}</Avatar>
        </Tooltip>
    );
}

export function PersonAvatarGroup({ personIds = [], size = defaultSize, max = 10 }) {
    personIds.sort();
    return (
        <AvatarGroup max={max} size={size}>
            {personIds.map(personId =>
                <PersonAvatar personId={personId} size={size} />
            )}
        </AvatarGroup>
    );
}
