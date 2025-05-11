import { CalendarMonth } from "src/components/icons";
import { Button } from "@mui/material";


export function ChooseEventButton(props) {
    return (
        <Button variant="outlined" startIcon={<CalendarMonth />} {...props}>
            Kies event
        </Button>
    );
}
