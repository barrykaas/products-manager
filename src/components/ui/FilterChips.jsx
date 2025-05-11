import { Chip, Grid } from "@mui/material";


export default function FilterChips({ filters = [] }) {
    return (
        <Grid container>
            {filters.map((filter) =>
                <Chip
                    key={filter.label}
                    label={filter.label}
                    onClick={() => filter.toggle(filter.state)}
                    color={filter.state ? 'primary' : undefined}
                />
            )}
        </Grid>
    );
}
