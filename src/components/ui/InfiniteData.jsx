import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";


const footerHeight = 96;

export default function InfiniteData({
    children,
    hasMore,
    onMore,
    isLoading,
    empty,
    emptyMessage = 'Geen resultaten',
    ...props
}) {
    let footer;

    if (isLoading) {
        footer = <CircularProgress />;
    } else if (empty) {
        footer = (
            <Typography
                fontStyle="italic"
                color="GrayText"
            >
                {emptyMessage}
            </Typography>
        );
    } else {
        footer = (
            <Button
                disabled={!hasMore}
                onClick={onMore}
                fullWidth
                sx={{ height: footerHeight }}
            >
                Meer laden
            </Button>
        );
    }

    return (
        <Stack
            alignItems='center'
            {...props}
        >
            {children}
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={footerHeight}
                width={1}
            >
                {footer}
            </Box>
        </Stack>
    );
}
