import { Chip } from "@mui/material";

import { usePerson } from "./PersonsApiQueries";
import PersonAvatar from "./Avatars/Avatars";


export default function PersonChip({ personId, ...props }) {
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