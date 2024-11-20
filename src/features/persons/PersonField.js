import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { InputAdornment, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

import { usePerson, usePersons } from './api';
import { PersonAvatar } from './PersonAvatar';


const defaultLabel = "Persoon";

function PersonsField({ value, setValue, disabled = false, label = defaultLabel, TextFieldProps }) {
    const personsQuery = usePersons();

    if (disabled) {
        return <TextField disabled fullWidth label={
            typeof disabled === 'string' ? `${disabled}` : defaultLabel
        } />;
    }
    if (personsQuery.isLoading) {
        return <TextField disabled fullWidth label="Personen worden geladen..." />;
    }
    if (personsQuery.isError) {
        return <div>Error fetching data</div>;
    }

    const loading = personsQuery.isLoading;
    const allPersons = personsQuery.data;

    return (
        <Autocomplete
            id="personsField"
            autoHighlight
            fullWidth
            value={value}
            onChange={(event, newValue, reason) => setValue(newValue)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) =>
                <ListItem {...props}>
                    <ListItemAvatar>
                        <PersonAvatar personId={option.id} />
                    </ListItemAvatar>
                    <ListItemText>
                        {option.name}
                    </ListItemText>
                </ListItem>
            }
            options={allPersons}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        startAdornment:
                            !!value && (
                                <InputAdornment position="start">
                                    <PersonAvatar personId={value?.id} />
                                </InputAdornment>
                            )
                    }}
                    {...TextFieldProps}
                />
            )}
        />
    );
}


export function PersonField({ value, setValue, ...props }) {
    const person = usePerson(value).data;

    return (
        <PersonsField
            value={person || null}
            setValue={(person) => setValue(person?.id || null)}
            {...props}
        />
    );
}
