import { Box, Button, IconButton, InputAdornment, Skeleton, Stack, TextField, Tooltip } from '@mui/material';
import { useFormik } from 'formik';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import * as yup from 'yup';

import { createProductFn } from './ProductsApiQueries';
import UnitTypeSelector, { useUnitType } from './ProductUnitTypeSelector';

import apiPath from '../Api/ApiPath';
import { QrCodeScanner } from '@mui/icons-material';
import { useState } from 'react';
import ScannedItemsList from '../ScannedItems/ScannedItemsList';
import FormDialog from '../Helpers/FormDialog';



// const validationSchema = yup.object({
//     date_added: yup
//         .date('Enter transaction date')
//         .required('Transaction date is required'),
//     name: yup
//         .string('Enter name')
//         .required('Name is required'),
//     unit_number: yup
//         .number('Enter unit number')
//         .required('Unit number is required'),
//     unit_weightvol: yup
//         .number('Enter unit weight/volume')
//         .required('Unit weight/volume is required'),
//     unit_price: yup
//         .number('Enter unit price')
//         .required('Unit price is required'),
//     unit_type: yup
//         .number('Select unit type')
//         .required('Unit type is required')
// });


// const validationSchema = yup.object({
//     date_added: yup
//         .date('Enter transaction date')
//         .required('Transaction date is required'),
//     name: yup
//         .string('Enter name')
//         .required('Name is required'),
//     unit_number: yup
//         .number('Enter unit number')
//         .required('Unit number is required'),
//     unit_weightvol: yup
//         .mixed() // Use the mixed() type to allow number or null
//         .nullable() // Allow null values
//         .typeError('Unit weight/volume must be a number or null') // Custom error message for non-number values
//         .when('unit_type', {is: 3, then: yup.number().required('Unit weight/volume is required'), otherwise: yup.string().nullable()}),
//     unit_price: yup
//         .number('Enter unit price')
//         .required('Unit price is required'),
//     unit_type: yup
//         .number('Select unit type')
//         .required('Unit type is required')
// });


const validationSchema = yup.object({
    date_added: yup
        .date('Enter transaction date')
        .required('Transaction date is required'),
    name: yup
        .string('Enter name')
        .required('Name is required'),
    unit_number: yup
        .number('Enter unit number')
        .when('unit_type', ([unit_type], schema) => {
            if (unit_type === 2) {
                return schema;
            } else {
                return schema.required('Unit number is required');
            }
        }),
    unit_price: yup
        .number('Enter unit price')
        .required('Unit price is required'),
    unit_type: yup
        .number('Select unit type')
        .required('Unit type is required'),
    unit_weightvol: yup
        .number('Enter unit weight/volume')
        .when('unit_type', ([unit_type], schema) => {
            if (unit_type === 3) {
                return schema;
            } else {
                return schema.required('Unit weight/volume is required');
            }
        }),
    barcode: yup.string().nullable(),
});



export function ProductForm({
    handleFormSubmit,
    listTypes,
    initialValues = {
        date_added: new Date(),
        name: '',
        unit_number: '',
        unit_weightvol: '',
        unit_price: '',
        unit_type: '',
        barcode: '',
    },
}) {
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if(values.unit_type === 2) { // Per gewicht -> Verkocht voor een prijs per kilo (met eventueel een vast aantal per verpakking)
                values.unit_number = null;
            } else if(values.unit_type === 3) { // Per stuk, zonder gewicht -> Verkocht per stuk, zonder aanduiding van gewicht. 
                values.unit_weightvol = null;
            }
            console.log('Submit called');
            handleFormSubmit(values);
        },
    });

    function handleSelectBarcode(barcode) {
        console.log(`selected ${barcode}`);
        formik.setFieldValue('barcode', barcode);
        setBarcodeSelectOpen(false);
    }

    const [barcodeSelectOpen, setBarcodeSelectOpen] = useState(false);

    const {isLoading, isError, unitTypeInfo} = useUnitType(formik.values.unit_type)

    if(isLoading || isError) {
        return <Skeleton />
    }

    
    
    return (
        <Box sx={{ p: 2, height: 1, width: 1, bgcolor: 'background.paper' }}>
            <FormDialog title={"Producten"} open={barcodeSelectOpen} onClose={() => setBarcodeSelectOpen(false)}>
                <ScannedItemsList disableKnownProducts={true} selectBarcode={handleSelectBarcode} />
            </FormDialog>

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
        
                <UnitTypeSelector
                    name="unit_type"
                    label="Eenheid"
                    value={formik.values.unit_type}
                    onChange={formik.handleChange}
                    formik={formik}
                />

                <TextField
                    fullWidth
                    id="unit_number"
                    name="unit_number"
                    label="Aantal"
                    value={formik.values.unit_type === 2 ? '' : formik.values.unit_number}
                    disabled={formik.values.unit_type === 2}
                    onChange={formik.handleChange}
                    error={
                        formik.touched.unit_number && Boolean(formik.errors.unit_number)
                    }
                    helperText={
                        formik.touched.unit_number && formik.errors.unit_number
                    }
                />
                <TextField
                    fullWidth
                    disabled={unitTypeInfo === null || formik.values.unit_type === 3}
                    id="unit_weightvol"
                    name="unit_weightvol"
                    label="Unit weight/volume"
                    value={formik.values.unit_type === 3 ? '' : formik.values.unit_weightvol}
                    onChange={formik.handleChange}
                    InputProps={{
                        endAdornment: <InputAdornment position="start">{unitTypeInfo}</InputAdornment>,
                      }}
                    error={
                        formik.touched.unit_weightvol &&
                        Boolean(formik.errors.unit_weightvol)
                    }
                    helperText={
                        formik.touched.unit_weightvol && formik.errors.unit_weightvol
                    }
                />
                <TextField
                    fullWidth
                    id="unit_price"
                    name="unit_price"
                    label="Unit price"
                    value={formik.values.unit_price}
                    onChange={formik.handleChange}
                    error={formik.touched.unit_price && Boolean(formik.errors.unit_price)}
                    helperText={formik.touched.unit_price && formik.errors.unit_price}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                      }}
                />
                <TextField
                    fullWidth
                    id="barcode"
                    name="barcode"
                    label="Barcode"
                    value={formik.values.barcode}
                    onChange={formik.handleChange}
                    error={
                        formik.touched.barcode && Boolean(formik.errors.barcode)
                    }
                    helperText={
                        formik.touched.barcode && formik.errors.barcode
                    }
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          edge="end"
                            onClick={() => setBarcodeSelectOpen(true)}
                        >
                          <QrCodeScanner />
                        </IconButton>
                      </InputAdornment>
                    }}
                />


                

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
                    <DatePicker
                        id="date_added"
                        name="date_added"
                        label="Transaction date"
                        value={dayjs(formik.values.date_added)}
                        onChange={(value) => {
                            formik.setFieldValue('date_added', value);
                        }}
                        slotProps={{
                            textField: {
                                helperText:
                                    formik.touched.date_added && formik.errors.date_added,
                                error: formik.touched.date_added && Boolean(formik.errors.date_added),
                            },
                        }}
                    />
                </LocalizationProvider>

                <Button color="primary" variant="contained" fullWidth type="submit">
                    Save
                </Button>
            </Stack>
        </Box>
    );
};
export function ProductCreateForm({ didSuccesfullyCreate }) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createProductFn,
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            didSuccesfullyCreate("Toegevoegd!");
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`Error`)
        },
    });

    return (<ProductForm handleFormSubmit={(data) => { mutation.mutate(data) }} />)
}

export function ProductEditForm({ didSuccessfullyEdit, item }) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (updatedItem) => {
            console.log(updatedItem);
            return axios.patch(`${apiPath}/products/${item.id}/`, updatedItem)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            didSuccessfullyEdit("Aangepast!");
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`Error`)
        },
    });

    return (<ProductForm handleFormSubmit={(updatedItem) => { mutation.mutate(updatedItem) }}
        initialValues={item} />)
}
