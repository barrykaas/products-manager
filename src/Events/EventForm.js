import { useFormik } from 'formik';
import { Button, Box, TextField, Stack, Paper, Divider, Typography, List, CircularProgress } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import * as yup from 'yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { useQuery } from '@tanstack/react-query';

import { useEventDeleter, useEventMutator } from './EventsApiQueries';
import ParticipantsList from './ParticipantList';
import FormDialog from '../Helpers/FormDialog';
import { Fragment, useState } from 'react';
import { ReceiptFormDialog } from '../Receipts/ReceiptForm';
import { ReceiptsListItem } from '../Receipts/ReceiptsController/ReceiptsList';


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

export function EventForm({ onSuccessfulCreateEdit, initialValues = {} }) {
    const mutateEvent = useEventMutator({
        onSuccess: onSuccessfulCreateEdit
    });

    initialValues = {
        ...emptyForm(),
        ...initialValues
    };

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
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
                    <DatePicker
                        id="event_date"
                        name="event_date"
                        label="Datum"
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


                <Button color="primary" variant="contained" fullWidth type="submit">
                    Save
                </Button>
            </Stack>

            <Divider />

            {initialValues?.lists &&
                <RelatedLists event={initialValues} />
            }
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


function RelatedLists({ event }) {
    const [listFormOpen, setListFormOpen] = useState(false);
    const [currentList, setCurrentList] = useState();

    const { isError, error, isLoading, data } = useQuery({
        queryKey: ['lists', null, {
            event: event.id,
            page_size: 1000
        }]
    });

    if (isError) {
        return <p>{JSON.stringify(error)}</p>;
    } else if (isLoading) {
        return <CircularProgress />;
    }

    const lists = data.results || [];
    if (lists.length === 0) return null;

    return (
        <Stack spacing={2} sx={{ py: 2 }}>
            <Typography variant='h6'>Gerelateerde bonnetjes:</Typography>
            <List component={Paper}>
                {lists.map(list =>
                    <Fragment key={list.id}>
                        <ReceiptsListItem
                            item={list}
                            onSelect={() => {
                                setCurrentList(list);
                                setListFormOpen(true);
                            }}
                        />
                    </Fragment>
                )}
            </List>

            <ReceiptFormDialog
                open={listFormOpen}
                onClose={() => setListFormOpen(false)}
                initialValues={currentList}
            />
        </Stack>
    );
}
