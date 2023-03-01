import React, { useState, useEffect } from 'react';
import { Item, Chip, Stack, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Collapse, Button, ListItemAvatar, Avatar, Divider} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function EventItem({event}) {
    const handleDelete = () => {
        console.info('You clicked the delete icon.');
    };
    
    const handleClick = () => {
        console.info('You clicked the icon.');
    };

    let chips = event.participants.map(participant => (
        <Chip label={participant} color="primary" variant="outlined" onDelete={handleDelete} />
    ));

    return (

        <Card sx={{mt: 5, textAlign: "left"}}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Aardappels met groente
                </Typography>
                <Stack direction="row" spacing={1} sx={{mt: 2}}>
                    <Chip label={event.date} color="success" variant="outlined" onClick={handleClick} />
                    <Divider orientation="vertical" flexItem />
                    {chips}
                    <Chip icon={<AddCircleIcon />} variant="outlined" color="primary" label="Add" onClick={handleClick}/>
                    
                </Stack>
            </CardContent>
            {/* <CardActions>
                
                
            </CardActions> */}
        </Card>
    )
}

export default EventItem;