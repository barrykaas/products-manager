import { Box, Button, IconButton, InputAdornment, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { AddCircle, QrCodeScanner, RemoveCircle } from '@mui/icons-material';
import { useConfirm } from 'material-ui-confirm';
import 'dayjs/locale/en-gb';
import * as yup from 'yup';


import { useProductDeleter, useProductMutator } from './ProductsApiQueries';
import ScannedItemsController from '../ScannedItems/ScannedItemsController';
import FormDialog from '../Helpers/FormDialog';
import { BrandsIdField } from '../Brands/BrandsField';
import { UnitTypeIdField } from '../UnitTypes/UnitTypeField';
import { useUnitTypes } from '../UnitTypes/UnitTypeQueries';
import { isoToRelativeDate } from '../Helpers/dateTime';


const validationSchema = yup.object({
    // date_added: yup
    //     .date('Enter transaction date')
    //     .required('Transaction date is required'),
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
    initialValues = {},
}) {
    const emptyForm = {
        name: '',
        brand: null,
        unit_number: 1,
        unit_weightvol: '',
        unit_price: '',
        unit_type: 5, // per stuk met gewicht
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

    const unitNumberDisabled = formik.values.unit_type === 2;
    const decrementUnitNumber = () => formik.setFieldValue('unit_number',
        formik.values.unit_number - 1
    );
    const incrementUnitNumber = () => formik.setFieldValue('unit_number',
        formik.values.unit_number + 1
    );

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
                    label="Naam"
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
                    disabled={unitNumberDisabled}
                    onChange={formik.handleChange}
                    onFocus={(event) => event.target.select()}
                    error={
                        formik.touched.unit_number && Boolean(formik.errors.unit_number)
                    }
                    helperText={
                        formik.touched.unit_number && formik.errors.unit_number
                    }
                    InputProps={{
                        startAdornment:
                            <IconButton
                                onClick={decrementUnitNumber}
                                disabled={unitNumberDisabled || formik.values.unit_number <= 1}
                            >
                                <RemoveCircle />
                            </IconButton>,
                        endAdornment:
                            <IconButton
                                onClick={incrementUnitNumber}
                                disabled={unitNumberDisabled}
                            >
                                <AddCircle />
                            </IconButton>,
                    }}
                />
                <TextField
                    fullWidth
                    disabled={unitType === null || formik.values.unit_type === 3}
                    id="unit_weightvol"
                    name="unit_weightvol"
                    label="Gewicht/inhoud"
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
                    label="Prijs"
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

                {initialValues?.date_added &&
                    <Typography fontStyle="italic">
                        Toegevoegd op {isoToRelativeDate(initialValues.date_added)}
                    </Typography>
                }

                <Button color="primary" variant="contained" fullWidth type="submit">
                    Save
                </Button>
            </Stack>
        </Box>
    );
};


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
            onDelete={existingProductId && onDelete}
        >
            <ProductForm initialValues={initialValues} handleFormSubmit={handleFormSubmit} />
        </FormDialog>
    );
}
