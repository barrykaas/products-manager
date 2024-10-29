import { Chip } from "@mui/material";

import { usePerson, usePersons } from "./PersonsApiQueries";
import PersonAvatar from "./Avatars/Avatars";


export default function PersonChip({ personId, ...props }) {
    const {isLoading, data} = usePerson(personId);
    const person = data;

    return (
        <Chip
            avatar={<PersonAvatar personId={personId} />}
            label={person?.name || `ID ${personId}`}
            {...props}
        />
    );
}