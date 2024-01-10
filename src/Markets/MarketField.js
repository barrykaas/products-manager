import { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useMarkets } from './MarketsApiQueries';

const defaultLabel = "Winkel";

export default function MarketField({ value, setValue, disabled = false, label = defaultLabel }) {
    const marketsQuery = useMarkets();

    if (disabled) {
        return <TextField disabled fullWidth label={
            typeof disabled === 'string' ? `${disabled}` : defaultLabel
        } />;
    }
    if (marketsQuery.isLoading) {
        return <TextField disabled fullWidth label={"Winkels worden geladen..."} />;
    }
    if (marketsQuery.isError) {
        return <div>Error fetching data</div>;
    }

    const loading = marketsQuery.isLoading;
    const allMarkets = marketsQuery.data;

    return (
        <Autocomplete
            id="marketField"
            autoHighlight
            value={value}
            onChange={(event, newValue, reason) => setValue(newValue)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={allMarkets}
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


export function MarketIdField({ value, setValue, disabled = false, label = defaultLabel }) {
    const { getMarket } = useMarkets();

    return (
        <MarketField
            value={value ? getMarket(value) : null}
            setValue={(market) => setValue(market?.id || null)}
            disabled={disabled}
            label={label}
        />
    );
}
