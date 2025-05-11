import { Skeleton, Stack, Typography } from "@mui/material";

import { PersonAvatar } from "./PersonAvatar";
import { usePerson } from "./api";


export function PersonLabel({ personId }) {
    const { data, isLoading } = usePerson(personId);

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={1}
        >
            <PersonAvatar personId={personId} />
            <Typography>
                {isLoading ? <Skeleton width={80} /> : data.name}
            </Typography>
        </Stack>
    );
}
