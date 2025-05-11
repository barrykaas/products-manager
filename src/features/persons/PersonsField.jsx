import { Autocomplete, Checkbox, TextField } from "@mui/material";

import { usePersons } from "./api";
import { PersonChip } from "./PersonChip";
import { PersonNameTag } from "./PersonNameTag";


export function PersonsField({ selected, setSelected, label = "Personen", ...props }) {
    const { data, isLoading } = usePersons();
    const persons = data || [];

    const fieldLabel = isLoading ? 'Personen laden...' : label;

    const value = isLoading ? selected.map(id => ({ id })) : persons.filter(person => selected.includes(person.id));

    return (
        <Autocomplete
            disabled={isLoading}
            multiple
            value={value}
            onChange={(event, value) => setSelected(value.map(person => person.id))}
            id="persons-multiple-autocomplete"
            options={persons}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                    <li key={key} {...optionProps}>
                        <Checkbox
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        <PersonNameTag person={option} />
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextField {...params} label={fieldLabel} />
            )}
            renderTags={(value, getTagProps) =>
                value.map((option, index) =>
                    <PersonChip
                        personId={option.id}
                        {...getTagProps({ index })}
                    />
                )
            }
            {...props}
        />
    );
}
