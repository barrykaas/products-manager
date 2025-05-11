import { Box, Fab, Stack } from "@mui/material";

import { Add } from "src/components/icons";
import { linkOrOnClick } from "src/utils/linkOrOnClick";


export default function PageActions({
    onAdd,
    children,
    ...props
}) {
    return (
        <Box position="relative">
            <Stack
                spacing={1}
                alignItems="center"
                sx={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px"
                }}
                {...props}
            >
                {/* {onFilter &&
                    <Fab size="small" color="secondary" {...linkOrOnClick(onFilter)}>
                        <FilterAlt />
                    </Fab>
                }
                {onRefresh &&
                    <Fab size="small" {...linkOrOnClick(onRefresh)}>
                        <Refresh />
                    </Fab>
                } */}
                {onAdd &&
                    <Fab color="primary" {...linkOrOnClick(onAdd)}>
                        <Add />
                    </Fab>
                }
            </Stack>
            {children}
        </Box>
    );
}
