import { useState, Fragment } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useBrands, useBrandMutation as useBrandAdder, useBrand } from './api';


const fieldLabel = "Merk";
const noBrand = {name: "Merkloos", id: undefined}

export default function BrandsField({ value, setValue, disabled=false }) {
    const [open, setOpen] = useState(false);

    const brands = useBrands();
    const addBrand = useBrandAdder({
        onSuccess: (data) => {
            const newBrand = data.data;
            setValue(newBrand);
        }
    }).mutate;

    if (disabled) {
        return <TextField disabled fullWidth label={
            typeof disabled === 'string' ? `${disabled}` : fieldLabel
        } />;
    }
    if (brands.isLoading) {
        return <TextField disabled fullWidth label={"Merken worden geladen..."} />;
    }
    if (brands.isError) {
        return <div>Error fetching data</div>;
    }

    const loading = open && brands.isLoading;

    let allBrands = [noBrand].concat(brands.data);
    const filter = createFilterOptions();

    return (
        <Autocomplete
            id="brandsField"
            disableClearable
            autoHighlight
            open={open}
            value={value}
            onChange={(_event, newValue) => {
                if (typeof newValue === 'string') {
                    setValue({ name: newValue });
                } else if (newValue && newValue.inputValue) {
                    // "Voeg X toe" geselecteerd
                    const newBrandData = { name: newValue.inputValue };
                    addBrand(newBrandData);
                    setValue({ name: newValue.inputValue });
                } else {
                    setValue(newValue);
                }
            }}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return `Voeg "${option.inputValue}" toe`;
                }
                // Regular option
                return option.name;
            }}
            options={allBrands}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                if (params.inputValue !== '') {
                    filtered.push({
                        inputValue: params.inputValue,
                        name: params.inputValue,
                    });
                }

                return filtered;
            }}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={fieldLabel}
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


export function BrandsIdField({ value, setValue, disabled=false }) {
    // const brandsQuery = useBrands();
    const brand = useBrand(value).data;

    return (
        <BrandsField
            value={brand || null}
            setValue={(brand) => setValue(brand.id)}
            disabled={disabled}
        />
    );
}
