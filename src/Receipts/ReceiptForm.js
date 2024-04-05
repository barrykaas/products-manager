import { Stack, Button, Box, TextField, Divider } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import * as yup from "yup";
import { useFormik } from "formik";
import dayjs from "dayjs";

import { receiptListType, useListDeleter, useListMutator } from "../Lists/ListsApiQueries";
import ReceiptEditor from "./ReceiptEditor/ReceiptEditor";
import { PersonsIdField } from "../Persons/PersonsField";
import FormDialog from "../Helpers/FormDialog";
import { MarketIdField } from "../Markets/MarketField";
import { useSettings } from "../Settings/settings";
import { useConfirm } from "material-ui-confirm";


const emptyForm = () => ({
    type: receiptListType,
    transaction_date: new Date(),

    name: null,
    market: null,
    payer: null,
});

const validationSchema = yup.object({
    transaction_date: yup
        .date('Enter transaction date')
        .required('Transaction date is required'),
    name: yup
        .string('Enter name')
        .required('Name is required'),
    market: yup
        .number()
        .nullable(true),
    payer: yup
        .number()
        .nullable(true)
});


export default function ReceiptForm({ initialValues = {}, onSuccessfulCreateEdit }) {
    const [ settings ] = useSettings();

    initialValues = {
        ...emptyForm(),
        payer: settings.userId,
        market: settings.defaultMarket,
        ...initialValues
    };

    const existingReceiptId = initialValues?.id;

    const mutateList = useListMutator({
        onSuccess: (response) => {
            const newList = response.data;
            onSuccessfulCreateEdit(newList);
        }
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (existingReceiptId) values.id = existingReceiptId;
            mutateList(values);
        }
    });

    return (
        <Box sx={{ width: 1, bgcolor: 'background.paper' }}>
            <Stack
                sx={{ p: 2 }}
                component="form" spacing={2} onSubmit={formik.handleSubmit}>
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

                <MarketIdField
                    value={formik.values.market}
                    setValue={(marketId) => formik.setFieldValue("market", marketId)}
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
                    {existingReceiptId ? "Update" : "Creëer"}
                </Button>
            </Stack>

            <Divider />

            {existingReceiptId
                ? (
                    <ReceiptEditor receiptId={existingReceiptId} />
                )
                : null
            }

        </Box>
    );
}


export function ReceiptFormDialog({ open, onClose, initialValues, onSuccessfulCreateEdit, onSuccessfulDelete }) {
    const deleteList = useListDeleter({
        onSuccess: onSuccessfulDelete
    });

    const confirmDelete = useConfirm();



    const existingReceiptId = initialValues?.id;
    const onDelete = () => {
        confirmDelete({
            description: "Weet je zeker dat je deze lijst wilt verwijderen?"
        })
            .then(() => {
                deleteList(initialValues?.id);
            })
            .catch(() => { });
    };

    return (
        <FormDialog
            open={open}
            onClose={onClose}
            onDelete={existingReceiptId && onDelete}
            title={initialValues?.name ? "Bon bewerken" : 'Nieuw bonnetje'}
        >
            <ReceiptForm initialValues={initialValues} onSuccessfulCreateEdit={onSuccessfulCreateEdit} />
        </FormDialog>
    );
}
