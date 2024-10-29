import { List, CircularProgress, Button, Box, Stack } from "@mui/material";


export default function InfiniteList({ onMore, hasMore, isLoading, error, children, ListProps = {} }) {
    if (error) {
        return (<div>
            Error: {JSON.stringify(error)}
        </div>);
    }

    return (
        <Stack
            alignItems='center'
        >

            <List sx={{
                p: 0, width: 1, bgcolor: 'background.paper',
                '& ul': { padding: 0 },
            }} {...ListProps}>
                {children}
            </List>
            {
                isLoading
                    ? <CircularProgress sx={{ m: 1 }} />
                    : (
                        <Button
                            disabled={!hasMore}
                            onClick={onMore}
                            fullWidth
                            sx={{ height: 96 }}
                        >
                            Meer laden
                        </Button>
                    )
            }
            <Box height={128} />
        </Stack>
    );
}
