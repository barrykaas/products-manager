import { Stack, List, CircularProgress, Button } from "@mui/material";


export default function InfiniteList({ onMore, hasMore, isLoading, error, children }) {
    if (error) {
      return (<div>
        {JSON.stringify(error)}
      </div>);
    }

    return (
        <Stack sx={{ display: 'flex', height: '100%' }}>
          <List sx={{ p: 0, width: 1, bgcolor: 'background.paper' }}>
            {children}
          </List>
          {
            isLoading
              ? <CircularProgress />
              : (<Button
                disabled={!hasMore}
                onClick={onMore}
                >Meer laden</Button>)
          }
        </Stack>
      );
}
