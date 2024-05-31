import { Stack, Typography } from "@mui/material";

import SelectMultiple from "../Helpers/SelectMultiple";
import PersonAvatar from "./Avatars/Avatars";
import { usePersons } from "./PersonsApiQueries";


export default function SelectPersons({ selected, setSelected }) {
    const { data } = usePersons();

    const persons = data || [];
    const options = persons.map(p => p.id);
    const renderOption = personId =>
        <PersonOption person={persons.find(p => p.id === personId)} />;

    return <SelectMultiple
        options={options}
        renderOption={renderOption}
        selected={selected}
        setSelected={setSelected}
    />;
}

function PersonOption({ person }) {
    return <Stack direction="row" alignItems="center" spacing={1.5}>
        <PersonAvatar personId={person.id} />
        <Typography>{person.name}</Typography>
    </Stack>;
}
