import { Typography, ListItemText, Divider, List, ListItemButton } from "@mui/material";

function ShoppingListsListItem() {
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

function ShoppingsLists() {

    

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <ShoppingListsListItem />
            <Divider component="li" />
        </List>
    );
}

export default ShoppingsLists;