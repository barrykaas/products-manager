import { Typography, ListItemText, Divider, List, ListItemButton, Collapse } from "@mui/material";
import React from "react";
import { TransitionGroup } from 'react-transition-group';


function ShoppingListsListItem({ item, listTypes, onSelectList }) {

    function getDate() {
        const date = new Date(item.transaction_date);
        const formattedDate = date.toLocaleDateString();
        return formattedDate
    }

    function getType() {
        const filtered = listTypes.filter((type) => item.type === type.id)
        const itemType = filtered.length > 0 ? filtered[0].type : "";
        return itemType
    }

    return (<ListItemButton alignItems="flex-start" onClick={(event) => { onSelectList(item.id) }}>
        <ListItemText
            primary={item.name}
            secondary={
                <>
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >

                        {getType()}
                        {/* {listTypes.filter((type) => item.id === type.id)[0].type} */}
                    </Typography>
                    {" - " + getDate()}
                </>
            }
        />
    </ListItemButton>);
}

const ShoppingLists = (({ lists, listTypes, onSelectList }) => {
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {lists.map((item) => (
                <React.Fragment key={item.id}>
                    <ShoppingListsListItem item={item} listTypes={listTypes} onSelectList={onSelectList} />
                    <Divider component="li" />
                </React.Fragment>
            ))}
        </List>
    );
});

export default ShoppingLists;