import { Button, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import FormDialog from "./FormDialog";
import { MarketIdField } from "../Markets/MarketField";
import { PersonsIdField } from "../Persons/PersonsField";
import { DateRangeField } from "./DateField";


export default function FilterDialog({ open, onClose, options }) {
    const [searchParams, setSearchParams] = useSearchParams();

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
                {options.map((option) => optionToElement(
                    option,
                    (param) => searchParams.get(param),
                    updateParam
                ))}
            </Stack>
        </FormDialog>
    );
}

function optionToElement({ label, type, param }, getParam, updateParam) {
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
    }
}
