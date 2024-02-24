import { Avatar, Tooltip } from "@mui/material";

import { green, grey, red, orange, blue } from "@mui/material/colors";

const defaultSize = 30;

const kaasColors = {
    "Rutger": grey[300],
    "Julian": green[500],
    "Thijmen": red[500],
    "Jelle": blue[500],
    "Cas": orange[300],
}

export function DefaultAvatar({ person, size = defaultSize }) {    
    const initials = person.name.slice(0, 2);
    const color = kaasColors[person.name];

    return (
        <Tooltip arrow title={person.name}>
            <Avatar
                sx={{ height: size, width: size, bgcolor: color }}
            >{initials}</Avatar>
        </Tooltip>
    );
}

export function LoadingAvatar({personId, size = defaultSize }) {
    return (
        <Tooltip arrow title={`ID ${personId}`}>
            <Avatar
                sx={{ height: size, width: size }}
            >...</Avatar>
        </Tooltip>
    );
}

export function ErrorAvatar({personId, size = defaultSize }) {
    return (
        <Tooltip arrow title={`ID ${personId}`}>
            <Avatar
                sx={{ height: size, width: size, bgcolor: red[500]}}
            >!</Avatar>
        </Tooltip>
    );
}