import { Stack } from "@mui/material";
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

export function DateRangeField({
    labelBefore, labelAfter,
    valueBefore, valueAfter,
    onChangeBefore, onChangeAfter,
    spacing,
    ...props
}) {
    return (
        <Stack direction="row" spacing={spacing ?? 1.5}>
            <DateField
                label={labelAfter ?? "Na"}
                value={valueAfter}
                onChange={onChangeAfter}
                {...props}
            />
            <DateField
                label={labelBefore ?? "Voor"}
                value={valueBefore}
                onChange={onChangeBefore}
                {...props}
            />
        </Stack>
    );
}