import { Stack, Typography } from "@mui/material";

import { PersonAvatar } from "./PersonAvatar";


export function PersonNameTag({ person }) {
    return (
        <Stack direction="row" alignItems="center" spacing={1.5}>
            <PersonAvatar personId={person.id} />
            <Typography>{person.name}</Typography>
        </Stack>
    );
}
