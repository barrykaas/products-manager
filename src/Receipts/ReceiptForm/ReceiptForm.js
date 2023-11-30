import { receiptListType, useListMutator } from "../../Lists/ListsApiQueries";
import ReceiptEditor from "./ReceiptEditor";
import { Stack, Divider, Grid, Typography, Button, Paper, Box, TextField } from "@mui/material";
import { DateField, DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import * as yup from "yup";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { PersonsIdField } from "../../Persons/PersonsField";

const emptyForm = {
    type: receiptListType,
    transaction_date: new Date(),

    name: null,
    payer: null,
};

const validationSchema = yup.object({
    transaction_date: yup
        .date('Enter transaction date')
        .required('Transaction date is required'),
    name: yup
        .string('Enter name')
        .required('Name is required'),
    payer: yup
        .number()
        .nullable(true)
});


export default function ReceiptForm({ initialValues = emptyForm, onSuccessfulCreateEdit }) {
    const mutateList = useListMutator({
        onSuccess: (data, variables, context) => {
            const newList = variables; // ?
            onSuccessfulCreateEdit(newList);
        }
    });
    
    const handleFormSubmit = mutateList;

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleFormSubmit
    });


    return (
        <Box sx={{ p: 2, height: 1, width: 1, bgcolor: 'background.paper' }}>
            <Stack component="form" spacing={2} onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Naam van het bonnetje"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
                    <DatePicker
                        id="transaction_date"
                        name="transaction_date"
                        label="Datum"
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
                    />
                </LocalizationProvider>

                <PersonsIdField
                    label="Betaler"
                    value={formik.values.payer}
                    setValue={(payerId) => formik.setFieldValue("payer", payerId)}
                />

                <Button color="primary" variant="contained" fullWidth type="submit">
                    Create/Edit
                </Button>
            </Stack>

            <Box>{JSON.stringify(formik.values)}</Box>

            <ReceiptEditor />

        </Box>
    );
}
