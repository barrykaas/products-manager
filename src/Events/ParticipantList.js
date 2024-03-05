import { Checkbox, Chip, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Stack } from "@mui/material";
import React from "react";
import { usePersons } from "../Persons/PersonsApiQueries";


const participantPresets = [
    { name: "Kaasfood", participants: [1, 2, 4, 5] },
    { name: "🧀 Met Cas ", participants: [1, 2, 3, 4, 5] },
    { name: "🇮🇹 Met Frans", participants: [1, 2, 4, 5, 6] },
    { name: "😩 Zonder Thijmen", participants: [1, 2, 5] },
    { name: "❤️ Thijmen & Jelle", participants: [4, 5] },
];

export default function ParticipantsList({ setChecked, checked }) {
    const { isLoading, isError, data } = usePersons();

    const persons = data;

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    if (isLoading || isError) {
        return <Skeleton />
    }

    return (
        <Stack width={1}>
            <Grid container spacing={1} margin={1} width={1}>
                {participantPresets.map((preset, index) => (
                    <Grid item key={index}>
                        <Chip
                            label={preset.name}
                            onClick={() => setChecked([...preset.participants])}
                        />
                    </Grid>
                ))}
            </Grid>
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
        </Stack>
    );
}
