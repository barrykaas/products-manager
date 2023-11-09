import { useFormik } from 'formik';
import { Button, Box, TextField, Stack, MenuItem, Select, InputLabel, FormControl, Paper, Typography, Divider, Grid } from '@mui/material';

import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { DateField, DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { createEventFn } from './EventsApiQueries';

import EmbeddedParticipantsEditor from './EmbeddedParticipantsEditor'
import ParticipantsPicker from './ParticipantsController';
import ParticipantsList from './ParticipantList';

import apiPath from '../Api/ApiPath';

const validationSchema = yup.object({
    event_date: yup
        .date('Enter date of event')
        .required('Date of event is required'),
    event_participants: yup.array(yup.number()),
    name: yup
        .string('Enter name')
        .required('Name is required'),
});

export function EventForm({ handleFormSubmit, initialValues}) {
    const formik = useFormik({
        initialValues: initialValues ?? {
            event_date: new Date(),
            event_participants: [],
            name: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log("Submit called");
            handleFormSubmit(values);
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

export function EventCreateForm({ didSuccesfullyCreate }) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createEventFn,
        onSuccess: ({data}) => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            didSuccesfullyCreate("Toegevoegd!");
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`Error`)
        },
    });

    return (<EventForm  handleFormSubmit={(data) => { mutation.mutate(data) }} />)
}

export function EventEditForm({ didSuccesfullyEdit, item }) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (updatedItem) => {
            return axios.patch(`${apiPath}/events/${item.id}/`, updatedItem)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            didSuccesfullyEdit("Aangepast!");
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`Error`)
        },
    });

    return (<EventForm  handleFormSubmit={(updatedItem) => { mutation.mutate(updatedItem) }} 
                        initialValues={item} />)
}