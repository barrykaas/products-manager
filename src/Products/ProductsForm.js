import { Box, Button, IconButton, InputAdornment, Skeleton, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { QrCodeScanner } from '@mui/icons-material';
import { useConfirm } from 'material-ui-confirm';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import * as yup from 'yup';


import { createProductFn, useProductDeleter, useProductMutator } from './ProductsApiQueries';
import apiPath from '../Api/ApiPath';
import ScannedItemsController from '../ScannedItems/ScannedItemsController';
import FormDialog from '../Helpers/FormDialog';
import { BrandsIdField } from '../Brands/BrandsField';
import { UnitTypeIdField } from '../UnitTypes/UnitTypeField';
import { useUnitTypes } from '../UnitTypes/UnitTypeQueries';

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
    initialValues = {},
}) {
    const emptyForm = {
        date_added: new Date(),
        name: '',
        brand: null,
        unit_number: '',
        unit_weightvol: '',
        unit_price: '',
        unit_type: '',
        barcode: null,
    };

    initialValues = {
        ...emptyForm,
        ...initialValues
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (values.unit_type === 2) { // Per gewicht -> Verkocht voor een prijs per kilo (met eventueel een vast aantal per verpakking)
                values.unit_number = null;
            } else if (values.unit_type === 3) { // Per stuk, zonder gewicht -> Verkocht per stuk, zonder aanduiding van gewicht. 
                values.unit_weightvol = null;
            }

            if (values.barcode === '') {
                values.barcode = null;
            }
            handleFormSubmit(values);
        },
    });

    function handleSelectBarcode(barcodeItem) {
        formik.setFieldValue('barcode', barcodeItem.barcode);
        setBarcodeSelectOpen(false);
    }

    const [barcodeSelectOpen, setBarcodeSelectOpen] = useState(false);

    const { isLoading, isError, getUnitType } = useUnitTypes();
    const unitType = getUnitType(formik.values.unit_type);

    if (isLoading || isError) {
        return <Skeleton />
    }


    return (
        <Box sx={{ p: 2, height: 1, width: 1, bgcolor: 'background.paper' }}>
            <FormDialog hasToolbar={false} title={"Producten"} open={barcodeSelectOpen} onClose={() => setBarcodeSelectOpen(false)}>
                <ScannedItemsController onClose={() => setBarcodeSelectOpen(false)} disableKnownProducts selectBarcode={handleSelectBarcode} />
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

                <BrandsIdField
                    value={formik.values.brand}
                    setValue={(brandId) => formik.setFieldValue("brand", brandId)}
                />

                <UnitTypeIdField
                    value={formik.values.unit_type}
                    setValue={(unitTypeId) => formik.setFieldValue("unit_type", unitTypeId)}
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
                    disabled={unitType === null || formik.values.unit_type === 3}
                    id="unit_weightvol"
                    name="unit_weightvol"
                    label="Unit weight/volume"
                    value={formik.values.unit_type === 3 ? '' : formik.values.unit_weightvol}
                    onChange={formik.handleChange}
                    InputProps={{
                        endAdornment: <InputAdornment position="start">{unitType?.physical_unit}</InputAdornment>,
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


export function ProductFormDialog({ initialValues = {}, onSuccessfulCreateEdit, open, onClose }) {
    const existingProductId = initialValues?.id;
    const confirmDelete = useConfirm();

    const mutateProduct = useProductMutator({
        onSuccess: (response) => {
            const newProduct = response.data;
            onSuccessfulCreateEdit(newProduct);
        }
    });

    const deleteProduct = useProductDeleter({
        onSuccess: onClose
    });

    const onDelete = () => {
        confirmDelete({ description: `Verwijderen van ${initialValues?.name}` })
            .then(() => {
                deleteProduct(initialValues?.id);
            })
            .catch(() => { });
    };

    const handleFormSubmit = (item) => {
        if (existingProductId) item.id = existingProductId;
        mutateProduct(item);
    };

    return (
        <FormDialog
            title={existingProductId ? "Product bewerken" : "Nieuw product"}
            open={open}
            onClose={onClose}
            secondaryButtons={
                existingProductId ? (
                    <Button variant="contained" color={"error"} onClick={onDelete}>
                        Verwijderen
                    </Button>
                ) : null
            }
        >
            <ProductForm initialValues={initialValues} handleFormSubmit={handleFormSubmit} />
        </FormDialog>
    );
}
