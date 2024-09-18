import { Chip } from "@mui/material";

export default function IdLabel({ id }) {
    return (
        <Chip
            label={id}
            size="small"
            sx={{
                fontFamily: 'monospace'
            }}
        />
    );
}
