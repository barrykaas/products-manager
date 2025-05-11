import * as yup from 'yup';
import { useFormik } from 'formik';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import { useConfirm } from 'material-ui-confirm';

import { AddCircle, QrCodeScanner, RemoveCircle } from "src/components/icons";
import DialogWindow from "src/components/ui/DialogWindow";
import ModelInstanceForm from "src/components/ui/ModelInstanceForm";
import Page from "src/components/ui/Page";
import { useTemporaryState } from "src/hooks/useTemporaryState";
import { BrandField } from 'src/features/brands';
import DateLabel from 'src/components/ui/DateLabel';
import { UnitTypeField } from './UnitTypeField';
import { useProductDeleter, useProductMutation, useUnitType } from './api';
import { ScannedItemsPage } from 'src/features/scannedItems';
import { SearchParamsProvider } from 'src/context/searchParams';


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

const emptyForm = () => ({
    name: '',
    brand: null,
    pieces: 1,
    volume: '',
    price: '',
    unit_type_id: 5, // per stuk met gewicht
    barcode: null,
});

export function ProductForm({
    initialValues,
    onSuccessfulCreateEdit,
    onSuccessfulDelete
}) {
    const [instanceId, setInstanceId] = useState(initialValues.id);
    const instanceExists = !!instanceId;
    const [success, setSuccess] = useTemporaryState(undefined);
    const confirmDelete = useConfirm();

    initialValues = {
        ...emptyForm(),
        ...initialValues
    };
    if (initialValues.unit_type) {
        initialValues.unit_type_id = initialValues.unit_type.id;
        delete initialValues.unit_type;
    }

    const mutateProduct = useProductMutation({
        onSuccess: (instance) => {
            setSuccess('success');
            setInstanceId(instance.id);
            onSuccessfulCreateEdit(instance);
        },
        onError: () => setSuccess('error')
    }).mutate;

    const deleteProduct = useProductDeleter({
        onSuccess: onSuccessfulDelete
    }).mutate;

    const onDelete = () => {
        confirmDelete({ description: 'Verwijderen?' })
            .then(() => {
                deleteProduct(instanceId);
            })
            .catch(() => { });
    };

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
            mutateProduct(values);
        },
    });

    const unitType = useUnitType(formik.values.unit_type_id).data;

    function handleSelectBarcode(barcode) {
        formik.setFieldValue('barcode', barcode);
        setBarcodeSelectOpen(false);
    }

    const [barcodeSelectOpen, setBarcodeSelectOpen] = useState(false);

    const unitNumberDisabled = formik.values.unit_type_id === 2;
    const decrementUnitNumber = () => formik.setFieldValue('pieces',
        formik.values.pieces - 1
    );
    const incrementUnitNumber = () => formik.setFieldValue('pieces',
        formik.values.pieces + 1
    );


    return (
        <>
            <ModelInstanceForm
                onSubmit={formik.handleSubmit}
                onDelete={onDelete}
                instanceExists={instanceExists}
                success={success}
            >
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

                <BrandField
                    value={formik.values.brand}
                    setValue={(brandId) => formik.setFieldValue("brand", brandId)}
                />

                <UnitTypeField
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
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
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
                                edge="end"
                                onClick={() => setBarcodeSelectOpen(true)}
                            >
                                <QrCodeScanner />
                            </IconButton>
                        </InputAdornment>
                    }}
                />

                <DateLabel
                    created={initialValues.date_created}
                    modified={initialValues.date_modified}
                />
            </ModelInstanceForm>

            <DialogWindow
                open={barcodeSelectOpen}
                onClose={() => setBarcodeSelectOpen(false)}
            >
                <SearchParamsProvider
                    initialSearchParams={{ product_unknown: true }}
                >
                    <ScannedItemsPage
                        onClose={() => setBarcodeSelectOpen(false)}
                        onClickBarcode={handleSelectBarcode}
                    />
                </SearchParamsProvider>
            </DialogWindow>
        </>
    );
}


export function ProductFormDialog({
    open,
    onClose,
    initialValues,
    onSuccessfulCreateEdit,
    onSuccessfulDelete
}) {
    const existingInstance = !!initialValues.id;

    return (
        <DialogWindow
            onClose={onClose}
            open={open}
        >
            <Page
                title={existingInstance ? 'Bewerk product' : 'Creëer product'}
                onClose={onClose}
                pb={0}
            >
                <ProductForm
                    initialValues={initialValues}
                    onSuccessfulCreateEdit={onSuccessfulCreateEdit}
                    onSuccessfulDelete={onSuccessfulDelete}
                />
            </Page>
        </DialogWindow>
    );
}
