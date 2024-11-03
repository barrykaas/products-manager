import { Chip, Stack } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import { isoToRelativeDateTime } from "../Helpers/dateTime";


export default function DateLabel({ created, modified }) {
    if (!created && !modified) return;

    return (
        <Stack
            direction="row"
            spacing={1}
            overflow="scroll"
        >
            {created &&
                <Chip
                    label={isoToRelativeDateTime(created)}
                    icon={<Add />}
                />
            }
            {modified &&
                <Chip
                    label={isoToRelativeDateTime(modified)}
                    icon={<Edit />}
                />
            }
        </Stack>
    );
}
