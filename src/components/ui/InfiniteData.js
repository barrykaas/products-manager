import { Button, CircularProgress, Stack } from "@mui/material";


export default function InfiniteData({
    children,
    hasMore,
    onMore,
    isLoading,
}) {
    return (
        <Stack
            alignItems='center'
        >
            {children}
            {isLoading && <CircularProgress />}
            <Button
                disabled={!hasMore}
                onClick={onMore}
                fullWidth
                sx={{ height: 96 }}
            >
                Meer laden
            </Button>
        </Stack>
    );
}
