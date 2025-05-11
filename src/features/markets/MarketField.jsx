import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Avatar, InputAdornment, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

import { useMarkets } from './api';


const defaultLabel = "Winkel";

function MarketField({ value, setValue, disabled = false, label = defaultLabel }) {
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
            onChange={(_event, newValue) => setValue(newValue)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={allMarkets}
            loading={loading}
            renderOption={(props, option) =>
                <ListItem {...props} key={option.id}>
                    <ListItemAvatar>
                        <MarketAvatar market={option} />
                    </ListItemAvatar>
                    <ListItemText>
                        {option.name}
                    </ListItemText>
                </ListItem>
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        startAdornment:
                            !!value && (
                                <InputAdornment>
                                    <MarketAvatar market={value} />
                                </InputAdornment>
                            )
                    }}
                />
            )}
        />
    );
}

function MarketAvatar({ market }) {
    if (!market?.image) return;
    return (
        <Avatar
            variant='rounded'
            sx={{ background: 'none' }}
        >
            <img src={market.image} alt="sfgdf" style={{ width: '100%' }} />
        </Avatar>
    );
}

export function MarketIdField({ value, setValue, disabled = false, label = defaultLabel }) {
    const { data } = useMarkets();
    const market = data ? data.find((m) => m.id === value) : undefined;

    return (
        <MarketField
            value={value ? market : null}
            setValue={(market) => setValue(market?.id || null)}
            disabled={disabled}
            label={label}
        />
    );
}
