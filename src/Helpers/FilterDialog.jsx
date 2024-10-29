import { Autocomplete, Button, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Fragment } from "react";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

import FormDialog from "./FormDialog";
import { MarketIdField } from "../Markets/MarketField";
import { PersonsIdField } from "../Persons/PersonsField";
import { DateRangeField } from "./DateField";
import MultiplePersonsField from "../Persons/MultiplePersonsField";


export default function FilterDialog({ open, onClose, options, searchParams, setSearchParams }) {
    const updateParam = (key, value) => {
        if (!value && value !== 0) {
            searchParams.delete(key);
        } else {
            searchParams.set(key, value);
        }
        setSearchParams(searchParams);
    };

    const onReset = () => {
        for (const { param, type } of options) {
            if (type === "daterange") {
                searchParams.delete(param + '_before');
                searchParams.delete(param + '_after');
            } else {
                searchParams.delete(param);
            }
        }
        setSearchParams(searchParams);
    };

    return (
        <FormDialog
            open={open}
            title="Filter"
            onClose={onClose}
            secondaryButtons={
                <Button variant="contained" onClick={onReset}>
                    Reset
                </Button>
            }
        >
            <Stack component="form" p={2} spacing={1.5}
                sx={{ bgcolor: 'background.paper' }}
            >
                {options.map((option) =>
                    <Fragment key={option.param}>
                        {optionToElement(
                            option,
                            (param) => searchParams.get(param),
                            updateParam
                        )}
                    </Fragment>
                )}
            </Stack>
        </FormDialog>
    );
}

function optionToElement({ label, type, param, ...extra }, getParam, updateParam) {
    if (type === 'market') {
        return <MarketIdField label={label}
            value={Number(getParam(param))}
            setValue={value => updateParam(param, value)}
        />;
    } else if (type === 'person') {
        return <PersonsIdField label={label}
            value={Number(getParam(param))}
            setValue={value => updateParam(param, value)}
        />;
    } else if (type === 'daterange') {
        return <>
            <Typography>{label}</Typography>
            <DateRangeField
                clearable
                valueAfter={getParam(param + '_after')}
                onChangeAfter={value => updateParam(param + '_after', value?.toISOString())}
                valueBefore={getParam(param + '_before')}
                onChangeBefore={value => updateParam(param + '_before', value?.toISOString())}
            />
        </>;
    } else if (type === 'persons') {
        return (
            <MultiplePersonsField
                label={label}
                selected={getParam(param)?.split(',')?.map(Number) || []}
                setSelected={newSelected => updateParam(param, newSelected.sort().join(','))}
            />
        );
    } else if (type === 'ordering') {
        const { options } = extra;
        const orderingField = getParam(param);
        const descending = orderingField && orderingField.startsWith('-');
        const field = descending ? orderingField.slice(1) : orderingField;

        return (
            <Stack
                direction="row"
                spacing={2}
            >
                <Autocomplete
                    id="ordering"
                    autoHighlight
                    fullWidth
                    value={field}
                    onChange={(event, newValue) => updateParam(
                        param,
                        (descending && newValue) ? '-' + newValue : newValue
                    )}
                    isOptionEqualToValue={(option, value) => option === value}
                    getOptionLabel={(option) => options[option]}
                    options={Object.keys(options)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label || 'Sorteer op'}
                        />
                    )}
                />
                <ToggleButtonGroup
                    value={descending ? 'desc' : 'asc'}
                    exclusive
                    onChange={(event, value) => {
                        if (value === 'desc') {
                            updateParam(param, '-' + field);
                        } else if (value === 'asc') {
                            updateParam(param, field);
                        }
                    }}
                >
                    <ToggleButton value="asc">
                        <ArrowUpward />
                    </ToggleButton>
                    <ToggleButton value="desc">
                        <ArrowDownward />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>
        );
    }
}
