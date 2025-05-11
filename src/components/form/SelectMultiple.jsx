import { Checkbox, List, ListItem, ListItemButton, ListItemIcon } from "@mui/material";


export default function SelectMultiple({ options, renderOption, selected, setSelected }) {
    const toggleOption = (option) => {
        const currentIndex = selected.indexOf(option);
        if (currentIndex === -1) {
            setSelected([...selected, option]);
        } else {
            const newSelected = [...selected];
            newSelected.splice(currentIndex, 1);
            setSelected(newSelected);
        }
    };

    return (
        <List width={1}>
            {options.map(option =>
                <ListItem
                    key={option}
                    disablePadding
                >
                    <ListItemButton
                        onClick={() => toggleOption(option)}
                        dense
                    >
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={selected.indexOf(option) !== -1}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemIcon>
                        {renderOption(option)}
                    </ListItemButton>
                </ListItem>
            )}
        </List>
    );
}
