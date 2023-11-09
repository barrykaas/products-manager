import { Typography, ListItemText, Divider, List, ListItemButton, Collapse, Skeleton } from "@mui/material";
import React from "react";
import { getPersonsFn } from "../Events/EventsApiQueries";
import { useQuery } from "@tanstack/react-query";


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

    const { isLoading, isError, data, error } = useQuery({ queryKey: ['persons'], queryFn: getPersonsFn })

    if (isLoading || isError) {
        return <Skeleton />
    }

    const persons = data.data;

    function getPayer() {
        const person = persons.find((person) => person.id === item.payer);
        return (
            person ?
            <>
            {' - '}
            <Typography sx={{ display: 'inline', fontStyle: 'italic' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                {person.name}
            </Typography>
            </> 
            
            : 
            '');
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
                    {getPayer()}
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