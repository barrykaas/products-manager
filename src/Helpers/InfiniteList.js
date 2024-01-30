import { Stack, List, CircularProgress, Button, Box } from "@mui/material";


export default function InfiniteList({ onMore, hasMore, isLoading, error, children }) {
    if (error) {
      return (<div>
        Error: {JSON.stringify(error)}
      </div>);
    }

    return (
        <Stack sx={{ display: 'flex', height: '100%' }} alignItems='center'>
          <List sx={{ p: 0, width: 1, bgcolor: 'background.paper' }}>
            {children}
          </List>
          {
            isLoading
              ? <CircularProgress sx={{ m: 1 }} />
              : (<Button
                disabled={!hasMore}
                onClick={onMore}
                >Meer laden</Button>)
          }
          <Box height="200px" />
        </Stack>
      );
}
