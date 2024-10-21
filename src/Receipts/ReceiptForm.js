import { Stack, Button, TextField, Typography } from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import { receiptListType, useListDeleter } from "../Lists/ListsApiQueries";
import { PersonsIdField } from "../Persons/PersonsField";
import FormDialog from "../Helpers/FormDialog";
import { MarketIdField } from "../Markets/MarketField";
import { useSettings } from "../Settings/settings";
import { useConfirm } from "material-ui-confirm";
import { DateField } from "../Helpers/DateField";
import { isoToRelativeDate } from "../Helpers/dateTime";
import { apiLocations, useApiDeleter, useApiMutation } from "../Api/Common";


const emptyForm = () => ({
    type: receiptListType,
    date: new Date(),

    name: null,
    market: null,
    payer: null,
});

const validationSchema = yup.object({
    date: yup
        .date()
        .nullable(true),
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


export default function ReceiptForm({ initialValues = {}, onSuccessfulCreateEdit, onSuccessfulDelete }) {
    const [settings] = useSettings();

    initialValues = {
        ...emptyForm(),
        payer: settings.userId,
        market: settings.defaultMarket,
        ...initialValues
    };

    const existingReceiptId = initialValues?.id;

    const mutateList = useApiMutation({
        queryKey: [apiLocations.receipts],
        onSuccess: (response) => {
            const newList = response.data;
            onSuccessfulCreateEdit(newList);
        }
    }).mutate;

    const deleteList = useApiDeleter({
        queryKey: [apiLocations.receipts],
        onSuccess: onSuccessfulDelete
    }).mutate;

    const confirmDelete = useConfirm();
    const onDelete = () => {
        confirmDelete({
            description: "Weet je zeker dat je deze lijst wilt verwijderen?"
        })
            .then(() => {
                deleteList(initialValues?.id);
            })
            .catch(() => { });
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (existingReceiptId) values.id = existingReceiptId;
            mutateList(values);
        }
    });

    return (
        <Stack
            sx={{ p: 2, maxWidth: 'sm' }}
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

            <DateField
                id="transaction_date"
                name="transaction_date"
                label="Datum"
                value={formik.values.date}
                onChange={(value) => {
                    formik.setFieldValue('date', value);
                }}
                slotProps={{
                    textField: {
                        helperText: formik.touched.date && formik.errors.date,
                        error: formik.touched.date && Boolean(formik.errors.date)
                    },
                }}
            />

            <PersonsIdField
                label="Betaler"
                value={formik.values.payer}
                setValue={(payerId) => formik.setFieldValue("payer", payerId)}
            />

            {initialValues?.date_created &&
                <Typography fontStyle="italic">
                    Gecreëerd op {isoToRelativeDate(initialValues.date_created)}
                </Typography>
            }

            <Button color="primary" variant="contained" fullWidth type="submit">
                {existingReceiptId ? "Update" : "Creëer"}
            </Button>

            {existingReceiptId &&
                <Button color="error" variant="contained" fullWidth onClick={onDelete}>
                    Verwijder
                </Button>
            }
        </Stack>
    );
}


export function ReceiptFormDialog({ open, onClose, initialValues, onSuccessfulCreateEdit, onSuccessfulDelete }) {
    const deleteList = useListDeleter({
        onSuccess: onSuccessfulDelete
    });

    const confirmDelete = useConfirm();
    const navigate = useNavigate();

    if (!onClose) {
        onClose = () => navigate('..');
    }

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
