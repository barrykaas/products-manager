import { Chip, Stack } from "@mui/material";

import { Add, Edit } from "src/components/icons";
import { isoToRelativeDateTime } from "src/utils/dateTime";


export default function DateLabel({ created, modified }) {
    if (!created && !modified) return;

    return (
        <Stack
            direction="row"
            spacing={1}
            overflow="auto"
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
