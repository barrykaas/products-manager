import { Chip } from "@mui/material";

import { usePerson } from "./api";
import { PersonAvatar } from "./PersonAvatar";


export function PersonChip({ personId, ...props }) {
    const { data } = usePerson(personId);
    const person = data;

    return (
        <Chip
            avatar={<PersonAvatar personId={personId} />}
            label={person?.name || `ID ${personId}`}
            {...props}
        />
    );
}
