import { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';

import { useUnitTypes } from './UnitTypeQueries';
import { apiLocations } from '../Api/Common';


const defaultLabel = "Eenheid";

export default function UnitTypeField({ value, setValue, disabled = false, label = defaultLabel }) {
    const unitTypesQuery = useQuery({
        queryKey: [apiLocations.unitTypes]
    });

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
            onChange={(event, newValue, reason) => setValue(newValue)}
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


export function UnitTypeIdField({ value, setValue, disabled = false, label = defaultLabel }) {
    const unitTypesQuery = useUnitTypes();

    return (
        <UnitTypeField
            value={value ? unitTypesQuery.getUnitType(value) : null}
            setValue={(unitType) => setValue(unitType?.id || null)}
            disabled={disabled}
            label={label}
        />
    );
}
