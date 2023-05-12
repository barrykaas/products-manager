import { Checkbox, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getPersonsFn } from "./EventsApiQueries";



export default function ParticipantsList({persons, handleToggle, checked}) {

    return (
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {persons.map((person) => {
          const labelId = `checkbox-list-label-${person.id}`;
  
          return (
            <ListItem
              key={person.id}
              disablePadding
            >
              <ListItemButton role={undefined} onClick={handleToggle(person.id)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(person.id) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${person.name}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    );
  }
