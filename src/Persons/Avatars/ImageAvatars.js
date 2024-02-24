import { Avatar, Tooltip } from "@mui/material";

const defaultSize = 30;

export function ImageAvatar({ person, size = defaultSize }) {    
    return (
        <Tooltip arrow title={person.name}>
            <Avatar
                sx={{ height: size, width: size }}
                src={person.image}
            />
        </Tooltip>
    );
}