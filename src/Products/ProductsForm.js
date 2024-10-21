import { Box, Button, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
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
import { isoToRelativeDate } from '../Helpers/dateTime';
import { useQuery } from '@tanstack/react-query';
import { apiLocations } from '../Api/Common';


const validationSchema = yup.object({
    name: yup
        .string('Enter name')
        .required('Name is required'),
    pieces: yup
        .number('Enter unit number')
        .when('unit_type', ([unit_type], schema) => {
            if (unit_type === 2) {
                return schema;
            } else {
                return schema.required('Unit number is required');
            }
        }),
    price: yup
        .number('Enter price')
        .required('Prijs is verplicht'),
    unit_type_id: yup
        .number('Select unit type')
        .required('Unit type is required'),
    volume: yup
        .number('Enter unit weight/volume')
        .when('unit_type', ([unit_type_id], schema) => {
            if (unit_type_id === 3) {
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
        pieces: 1,
        volume: '',
        price: '',
        unit_type_id: 5, // per stuk met gewicht
        barcode: null,
    };

    initialValues = {
        ...emptyForm,
        ...initialValues
    };
    if (initialValues.unit_type) {
        initialValues.unit_type_id = initialValues.unit_type.id;
        delete initialValues.unit_type;
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (values.unit_type_id === 2) { // Per gewicht -> Verkocht voor een prijs per kilo (met eventueel een vast aantal per verpakking)
                values.unit_number = null;
            } else if (values.unit_type_id === 3) { // Per stuk, zonder gewicht -> Verkocht per stuk, zonder aanduiding van gewicht. 
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

    const unitType = useQuery({
        queryKey: [apiLocations.unitTypes, formik.values.unit_type_id]
    }).data;


    const unitNumberDisabled = formik.values.unit_type_id === 2;
    const decrementUnitNumber = () => formik.setFieldValue('pieces',
        formik.values.pieces - 1
    );
    const incrementUnitNumber = () => formik.setFieldValue('pieces',
        formik.values.pieces + 1
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
                    value={formik.values.unit_type_id}
                    setValue={(unitTypeId) => formik.setFieldValue("unit_type_id", unitTypeId)}
                />

                <TextField
                    fullWidth
                    id="pieces"
                    name="pieces"
                    label="Aantal"
                    value={formik.values.unit_type === 2 ? '' : formik.values.pieces}
                    disabled={unitNumberDisabled}
                    onChange={formik.handleChange}
                    onFocus={(event) => event.target.select()}
                    error={
                        formik.touched.pieces && Boolean(formik.errors.pieces)
                    }
                    helperText={
                        formik.touched.pieces && formik.errors.pieces
                    }
                    InputProps={{
                        startAdornment:
                            <IconButton
                                onClick={decrementUnitNumber}
                                disabled={unitNumberDisabled || formik.values.pieces <= 1}
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
                    disabled={formik.values.unit_type === 3}
                    id="volume"
                    name="volume"
                    label="Gewicht/inhoud"
                    value={formik.values.unit_type === 3 ? '' : formik.values.volume}
                    onChange={formik.handleChange}
                    InputProps={{
                        endAdornment: <InputAdornment position="start">{unitType?.physical_unit || '?'}</InputAdornment>,
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
                    id="price"
                    name="price"
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
