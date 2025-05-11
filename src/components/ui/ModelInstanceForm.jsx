import { Delete, Save } from "src/components/icons";
import { Button, Stack } from "@mui/material";


export default function ModelInstanceForm({
    instanceExists,
    success,
    onDelete,
    children,
    ...props
}) {
    return (
        <Stack
            component="form"
            spacing={2}
            sx={{
                p: 2,
                maxWidth: 'sm'
            }}
            {...props}
        >
            {children}

            <Button
                color={success}
                variant="contained"
                fullWidth
                type="submit"
                startIcon={<Save />}
            >
                {instanceExists ? "Update" : "Creëer"}
            </Button>

            {instanceExists &&
                <Button
                    color="error"
                    variant="contained"
                    fullWidth
                    onClick={onDelete}
                    startIcon={<Delete />}
                >
                    Verwijder
                </Button>
            }
        </Stack>
    );
}
