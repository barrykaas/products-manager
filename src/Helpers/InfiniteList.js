import { List, CircularProgress, Button, Stack } from "@mui/material";


export default function InfiniteList({ onMore, hasMore, isLoading, error, children, ...props }) {
    if (error) {
        return (<div>
            Error: {JSON.stringify(error)}
        </div>);
    }

    return (
        <Stack
            alignItems='center'
        >
            <List {...props}>
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
        </Stack>
    );
}
