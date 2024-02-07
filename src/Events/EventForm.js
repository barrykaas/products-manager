import { useFormik } from 'formik';
import { Button, Box, TextField, Stack, Paper, Divider } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import * as yup from 'yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

import { useEventDeleter, useEventMutator } from './EventsApiQueries';
import ParticipantsList from './ParticipantList';
import FormDialog from '../Helpers/FormDialog';


const validationSchema = yup.object({
    event_date: yup
        .date('Enter date of event')
        .required('Date of event is required'),
    event_participants: yup.array(yup.number()),
    name: yup
        .string('Enter name')
        .required('Name is required'),
});

export function EventForm({ onSuccessfulCreateEdit, initialValues = {} }) {
    const mutateEvent = useEventMutator({
        onSuccess: onSuccessfulCreateEdit
    });

    const emptyForm = {
        event_date: new Date(),
        event_participants: [],
        name: '',
    };

    initialValues = {
        ...emptyForm,
        ...initialValues
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log("Submit called");
            mutateEvent(values);
        },
    });

    return (
        <Box sx={{ p: 2, height: 1, width: 1, bgcolor: 'background.paper' }}>
            <Stack component="form" spacing={2} onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
                    <DatePicker
                        id="event_date"
                        name="event_date"
                        label="Date of event"
                        value={dayjs(formik.values.event_date)}
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
                </LocalizationProvider>
                <Paper variant="outlined" >
                    <ParticipantsList setChecked={(value) => formik.setFieldValue('event_participants', value)} checked={formik.values.event_participants} />
                </Paper>

                <Button color="secondary" variant="contained" fullWidth>Add shoppinglist</Button>
                <Divider />
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Save
                </Button>
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
            secondaryButtons={
                eventExists ? (
                    <Button variant="contained" color={"error"} onClick={onDelete}>
                        Verwijderen
                    </Button>
                ) : null
            }
        >
            <EventForm initialValues={initialValues} onSuccessfulCreateEdit={onSuccessfulCreateEdit} />
        </FormDialog>
    );
}
