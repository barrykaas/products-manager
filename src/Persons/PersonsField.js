import { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { usePersons } from './PersonsApiQueries';

const defaultLabel = "Persoon";
// const noBrand = {name: "Merkloos", id: undefined}

export default function PersonsField({ value, setValue, disabled = false, label = defaultLabel, TextFieldProps }) {
    const personsQuery = usePersons();

    if (disabled) {
        return <TextField disabled fullWidth label={
            typeof disabled === 'string' ? `${disabled}` : defaultLabel
        } />;
    }
    if (personsQuery.isLoading) {
        return <TextField disabled fullWidth label={"Personen worden geladen..."} />;
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
            value={value}
            onChange={(event, newValue, reason) => setValue(newValue)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={allPersons}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </Fragment>
                        ),
                    }}
                    {...TextFieldProps}
                />
            )}
        />
    );
}


export function PersonsIdField({ value, setValue, ...props }) {
    const personsQuery = usePersons();

    return (
        <PersonsField
            value={value ? personsQuery.getPerson(value) : null}
            setValue={(person) => setValue(person?.id || null)}
            {...props}
        />
    );
}
