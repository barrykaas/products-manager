import { Avatar, Tooltip } from "@mui/material";
import { defaultSize } from "./Avatars";
import { useSettings } from "../../Settings/settings";


export function ImageAvatar({ person, size = defaultSize }) {
    const [{ nerdInfo }] = useSettings();

    return (
        <Tooltip arrow title={person.name + (nerdInfo ? ` (${person.id})` : '')}>
            <Avatar
                sx={{ height: size, width: size }}
                src={person.image}
            />
        </Tooltip>
    );
}
