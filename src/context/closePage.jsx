import { QuestionMark } from "src/components/icons";
import { IconButton } from "@mui/material";
import { createContext } from "react";

export const ClosePageContext = createContext(
    <IconButton
        edge="start"
        sx={{ mr: 2 }}
    >
        <QuestionMark />
    </IconButton>
);

// export function ClosePageProvider