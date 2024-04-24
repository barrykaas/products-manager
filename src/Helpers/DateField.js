import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/nl"


export function DateField({ label, clearable, value, ...props }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
            <DatePicker
                label={label ?? "Datum"}
                value={value && dayjs(value)}
                {...props}
                slotProps={{
                    field: { clearable, onClear: () => { }, fullWidth: true },
                    actionBar: {
                        actions: ['clear']
                      },
                    ...props?.slotProps
                }}
            />
        </LocalizationProvider>
    );
}
