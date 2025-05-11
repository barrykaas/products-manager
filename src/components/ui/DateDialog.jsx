import { Dialog } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/nl"


export default function DateDialog({ open, onClose, value, setValue, ...props }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
                <StaticDatePicker
                    onAccept={onClose}
                    value={value && dayjs(value)}
                    onChange={(value) => setValue(value)}
                    {...props}
                />
            </LocalizationProvider>
        </Dialog>
    );
}
