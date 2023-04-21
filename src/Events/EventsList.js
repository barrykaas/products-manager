import { ListItem, ListItemAvatar, Typography, ListItemText, Divider, Avatar, List, ListItemButton} from "@mui/material";

function EventsListItem() {
    return (<ListItemButton alignItems="flex-start">
        {/* <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar> */}
        <ListItemText
            primary="Currie"
            secondary={
                <>
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                        Cas, Julian
                    </Typography>
                    {" - July 20, 2023"}
                </>
            }
        />
    </ListItemButton>);
}

function EventsList() {
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <EventsListItem />
            <Divider component="li" />
        </List>
    );
}

export default EventsList;