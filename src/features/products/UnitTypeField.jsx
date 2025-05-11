import { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useUnitType, useUnitTypes } from './api';


const defaultLabel = "Eenheid";

function UnitTypeObjField({ value, setValue, disabled = false, label = defaultLabel }) {
    const unitTypesQuery = useUnitTypes();

    if (disabled) {
        return <TextField disabled fullWidth label={
            typeof disabled === 'string' ? `${disabled}` : defaultLabel
        } />;
    }
    if (unitTypesQuery.isLoading) {
        return <TextField disabled fullWidth label={"Eenheden worden geladen..."} />;
    }
    if (unitTypesQuery.isError) {
        return <div>Error fetching data</div>;
    }

    const loading = unitTypesQuery.isLoading;
    const allUnitTypes = unitTypesQuery.data;

    return (
        <Autocomplete
            id="unitTypesField"
            autoHighlight
            value={value}
            onChange={(_event, newValue) => setValue(newValue)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={allUnitTypes}
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
                />
            )}
        />
    );
}


export function UnitTypeField({ value, setValue, disabled = false, label = defaultLabel }) {
    const unitType = useUnitType(value).data;

    return (
        <UnitTypeObjField
            value={unitType || null}
            setValue={(unitType) => setValue(unitType?.id || null)}
            disabled={disabled}
            label={label}
        />
    );
}
