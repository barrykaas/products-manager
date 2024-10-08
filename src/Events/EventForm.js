import { useFormik } from 'formik';
import { Button, Box, TextField, Stack, Paper, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import * as yup from 'yup';
import 'dayjs/locale/en-gb';

import { useEventDeleter, useEventMutator } from './EventsApiQueries';
import ParticipantsList from './ParticipantList';
import FormDialog from '../Helpers/FormDialog';
import { DateField } from '../Helpers/DateField';
import { isoToRelativeDate } from '../Helpers/dateTime';


const defaultParticipants = [1, 2, 4, 5];

export const emptyForm = () => ({
    event_date: new Date(),
    event_participants: [...defaultParticipants],
    name: '',
});

const validationSchema = yup.object({
    event_date: yup
        .date('Enter date of event')
        .nullable(),
    event_participants: yup.array(yup.number()),
    name: yup
        .string('Enter name')
        .required('Name is required'),
});

export function EventForm({ onSuccessfulCreateEdit, onSuccessfulDelete, initialValues = {} }) {
    const confirmDelete = useConfirm();
    const deleteEvent = useEventDeleter({
        onSuccess: onSuccessfulDelete
    });
    const mutateEvent = useEventMutator({
        onSuccess: (response) => {
            const newItem = response.data;
            onSuccessfulCreateEdit(newItem);
        }
    });
    const onDelete = () => {
        confirmDelete({ description: `Verwijderen van ${initialValues?.name}` })
            .then(() => {
                deleteEvent(initialValues?.id);
            })
            .catch(() => { });
    };

    initialValues = {
        ...emptyForm(),
        ...initialValues
    };

    const eventExists = Boolean(initialValues?.id);

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            mutateEvent(values);
        },
    });

    return (
        <Box sx={{ p: 2, width: 1, bgcolor: 'background.paper' }}>
            <Stack component="form" spacing={2} onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Naam van het event"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />

                <DateField
                    id="event_date"
                    name="event_date"
                    label="Datum"
                    clearable
                    value={formik.values.event_date}
                    onChange={(value) => {
                        formik.setFieldValue('event_date', value);
                    }}
                    slotProps={{
                        textField: {
                            helperText: formik.touched.event_date && formik.errors.event_date,
                            error: formik.touched.event_date && Boolean(formik.errors.event_date)
                        },
                    }}
                />

                <Paper variant="outlined" >
                    <ParticipantsList setChecked={(value) => formik.setFieldValue('event_participants', value)} checked={formik.values.event_participants} />
                </Paper>

                {initialValues?.date_created &&
                    <Typography fontStyle="italic">
                        Gecreëerd op {isoToRelativeDate(initialValues.date_created)}
                    </Typography>
                }

                <Button color="primary" variant="contained" fullWidth type="submit">
                    Save
                </Button>

                {eventExists &&
                    <Button color="error" variant="contained" fullWidth onClick={onDelete}>
                        Verwijder
                    </Button>
                }
            </Stack>
        </Box>
    );
};

export function EventFormDialog({ initialValues = {}, onSuccessfulCreateEdit, open, onClose }) {
    const eventExists = Boolean(initialValues?.id);
    const confirmDelete = useConfirm();

    const deleteEvent = useEventDeleter({
        onSuccess: onClose
    });

    const onDelete = () => {
        confirmDelete({ description: `Verwijderen van ${initialValues?.name}` })
            .then(() => {
                deleteEvent(initialValues?.id);
            })
            .catch(() => { });
    };

    return (
        <FormDialog
            title={eventExists ? "Event bewerken" : "Nieuw event"}
            open={open}
            onClose={onClose}
            onDelete={eventExists && onDelete}
        >
            <EventForm initialValues={initialValues} onSuccessfulCreateEdit={onSuccessfulCreateEdit} />
        </FormDialog>
    );
}
