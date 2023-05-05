import { useFormik } from 'formik';
import { Button, Box, TextField, Stack, MenuItem, Select, InputLabel, FormControl, Paper, Typography, Divider } from '@mui/material';

import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShoppingListFn, editShoppingListFn } from './ShoppingListApiQueries';
import axios from 'axios';
import { DateField, DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import ShoppingListItemForm from './ShoppingListItemForm';

const validationSchema = yup.object({
    transaction_date: yup
        .date('Enter transaction date')
        .required('Transaction date is required'),
    type: yup
        .string('Enter transaction type')
        .required('Transaction type is required'),
    name: yup
        .string('Enter name')
        .required('Name is required'),
});



export function ShoppingListForm({handleFormSubmit, listTypes, initialValues = {
    transaction_date: new Date(),
    type: 2,
    name: '',
}}) {

    const formik = useFormik({
        initialValues: initialValues,
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
                    id="transaction_date"
                    name="transaction_date"
                    label="Transaction date"
                    value={dayjs(formik.values.transaction_date)}
                    onChange={(value) => {
                        formik.setFieldValue('transaction_date', value);
                        }}
                        slotProps={{
                            textField: {
                              helperText: formik.touched.transaction_date && formik.errors.transaction_date,
                              error: formik.touched.transaction_date && Boolean(formik.errors.transaction_date)
                            },
                          }}
                    // error={
                    //     formik.touched.transaction_date && Boolean(formik.errors.transaction_date)
                    // }
                    />
                    </LocalizationProvider>
                   

                    <TextField
                        className="px-2 my-2"
                        variant="outlined"
                        name="type"
                        id="type"
                        select
                        label="Type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                            formik.touched.type &&
                            Boolean(formik.errors.type)
                        }
                        helperText={
                            formik.touched.type && formik.errors.type
                        }
                    >
                        {listTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.type}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button color="primary" variant="contained" fullWidth type="submit">
                        Save
                    </Button>
                </Stack>
                
                <Stack spacing={2} sx={{mt:2}}>
                <Divider />
                    <Typography variant="h5" component="h5" color="text.primary">
                        Producten
                    </Typography>
                    <Paper>
                        <ShoppingListItemForm id={initialValues.id} />
                    </Paper>
                </Stack>
                
            </Box>
    );
};

const delay = ms => new Promise(res => setTimeout(res, ms));

export function ShoppingListCreateForm({listTypes, didSuccesfullyCreate}) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createShoppingListFn,
        onSuccess: () => {
            didSuccesfullyCreate();
            queryClient.invalidateQueries();
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`Error`)
          },
    });

    return (<ShoppingListForm handleFormSubmit={(data) => {mutation.mutate(data)}} listTypes={listTypes}/>)
}

export function ShoppingListEditForm({listTypes, didSuccesfullyEdit, item}) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (updatedItem) => {
            return axios.put(`https://django.producten.kaas/api/lists/${item.id}/`, updatedItem)
        },
        onSuccess: () => {
            didSuccesfullyEdit();
            queryClient.invalidateQueries();
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`Error`)
          },
    });

    return (<ShoppingListForm handleFormSubmit={(updatedItem) => {mutation.mutate(updatedItem)}} listTypes={listTypes} initialValues={item}/>)
}