import { Button } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";


export default function ChooseEventButton(props) {
    return (
        <Button variant="outlined" startIcon={<CalendarMonth />} {...props}>
            Kies event
        </Button>
    );
}
