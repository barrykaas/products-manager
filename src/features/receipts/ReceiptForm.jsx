import { TextField } from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import { useConfirm } from "material-ui-confirm";

import { useSettings } from "src/hooks/useSettings";
import DateField from "src/components/form/DateField";
import DateLabel from "src/components/ui/DateLabel";
import { useReceiptDeleter, useReceiptMutation } from "./api";
import { MarketField } from "src/features/markets";
import { PersonField } from "src/features/persons";
import { useTemporaryState } from "src/hooks/useTemporaryState";
import ModelInstanceForm from "src/components/ui/ModelInstanceForm";


const emptyForm = () => ({
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


export function ReceiptForm({ initialValues = {}, onSuccessfulCreateEdit, onSuccessfulDelete }) {
    const [settings] = useSettings();
    const [success, setSuccess] = useTemporaryState(undefined, 1000);

    initialValues = {
        ...emptyForm(),
        payer: settings.userId,
        market: settings.defaultMarket,
        ...initialValues
    };

    const existingReceiptId = initialValues?.id;

    const mutateList = useReceiptMutation({
        onSuccess: (response) => {
            const newList = response;
            setSuccess('success');
            if (onSuccessfulCreateEdit) onSuccessfulCreateEdit(newList);
        }
    }).mutate;

    const deleteList = useReceiptDeleter({
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
        <ModelInstanceForm
            onSubmit={formik.handleSubmit}
            onDelete={onDelete}
            success={success}
            instanceExists={!!existingReceiptId}
        >
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

            <MarketField
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

            <PersonField
                label="Betaler"
                value={formik.values.payer}
                setValue={(payerId) => formik.setFieldValue("payer", payerId)}
            />

            <DateLabel
                created={initialValues.date_created}
                modified={initialValues.date_modified}
            />
        </ModelInstanceForm>
    );
}
