import { Stack } from "@mui/material";
import DateField from "./DateField";


export default function DateRangeField({
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
