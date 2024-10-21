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
    date: new Date(),
    participations: defaultParticipants.map(
        p => ({ participant: p })
    ),
    name: '',
});

const validationSchema = yup.object({
    date: yup
        .date('Enter date of event')
        .nullable(),
    participations: yup.array(
        yup.object({
            participant: yup.number()
        })
    ),
    name: yup
        .string('Enter name')
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
                    value={formik.values.date}
                    onChange={(value) => {
                        formik.setFieldValue('date', value);
                    }}
                    slotProps={{
                        textField: {
                            helperText: formik.touched.date && formik.errors.date,
                            error: formik.touched.date && Boolean(formik.errors.date)
                        },
                    }}
                />

                <Paper variant="outlined" >
                    <ParticipantsList
                        setChecked={(participants) => formik.setFieldValue('participations', participants.map(
                            participant => ({ participant })
                        ))}
                        checked={formik.values.participations.map(p => p.participant)}
                    />
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
