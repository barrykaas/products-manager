import { Box, Button, Typography } from "@mui/material";

export default function Fallback({ error, resetErrorBoundary }) {
    return (
        <Box>
            <Typography>
                Error: {JSON.stringify(error)}
            </Typography>
            <Button onClick={resetErrorBoundary}>Reset</Button>
        </Box>
    );
}
