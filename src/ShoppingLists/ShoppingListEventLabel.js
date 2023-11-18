import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEventFn } from './EventLabelApi'; // Import your API function
import { Button, Chip, Stack, Typography } from '@mui/material';


function ShoppingListEventLabel({ eventId, handleAddProduct }) {
    const { data, isLoading, isError } = useQuery(['event', eventId], () =>
        getEventFn(eventId)
    );

    function getDate() {
        const date = new Date(data.event_date);
        const formattedDate = date.toLocaleDateString();
        return formattedDate
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching data</div>;
    }

    return (
        <Stack direction="row" spacing={1}>
            <Typography variant="h6" component="div">
                {data.name}
            </Typography>
            <Chip label={getDate()} variant="outlined" />
            <div style={{ flexGrow: 1 }}></div>
            <Button variant="outlined" size="small" onClick={(e) => handleAddProduct(eventId)}>Add product</Button>
        </Stack>

    );
}

export default ShoppingListEventLabel;