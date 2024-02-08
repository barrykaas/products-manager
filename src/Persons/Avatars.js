import { Avatar, Tooltip } from "@mui/material";

import { usePersons } from "./PersonsApiQueries";


export default function PersonAvatar({ personId, ...args }) {
    const { isLoading, isError, getPerson } = usePersons();

    let initials;
    if (isLoading) {
        initials = '...';
    } else if (isError) {
        initials = '!';
    }

    const person = getPerson(personId);
    if (person) {
        initials = person.name.slice(0, 2);
    }

    return (
        <Tooltip arrow title={person?.name ?? `ID ${personId}`}>
            <Avatar {...args} >{initials}</Avatar>
        </Tooltip>
    );
}
