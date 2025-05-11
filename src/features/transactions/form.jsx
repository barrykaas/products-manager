import { TextField } from "@mui/material";
import { useFormik } from "formik";
import { useConfirm } from "material-ui-confirm";

import DateField from "src/components/form/DateField";
import { PersonField } from "src/features/persons";
import CurrencyField from "src/components/form/CurrencyField";
import { useTransactionDeleter, useTransactionMutation } from "./api";
import ModelInstanceForm from "src/components/ui/ModelInstanceForm";
import { useTemporaryState } from "src/hooks/useTemporaryState";


const emptyForm = () => ({
    date: new Date(),
    amount: '',
    description: '',
});


export function TransactionForm({ initialTransaction, onSuccess, onSuccessfulDelete }) {
    const existing = !!initialTransaction.id;
    const [editStatus, setEditStatus] = useTemporaryState();
    const mutator = useTransactionMutation({
        onSuccess: () => {
            setEditStatus('success');
            if (onSuccess) onSuccess();
        },
        onError: () => {
            setEditStatus('error');
        },
    });

    const deleteTransaction = useTransactionDeleter({
        onSuccess: onSuccessfulDelete
    }).mutate;
    const confirm = useConfirm();
    const onDelete = () => confirm({
        title: "Weet je het zeker?",
    }).then(() => {
        deleteTransaction(initialTransaction.id);
    });

    const formik = useFormik({
        initialValues: {
            ...emptyForm(),
            ...initialTransaction
        },
        onSubmit: (values) => mutator.mutate(values)
    });

    return (
        <ModelInstanceForm
            instanceExists={existing}
            success={editStatus}
            onDelete={onDelete}
            onSubmit={formik.handleSubmit}
        >
            <TextField
                label="Beschrijving"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
            />
            <DateField
                label="Datum"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
            />
            <CurrencyField
                label="Bedrag"
                name="amount"
                value={formik.values.amount}
                setValue={(value) => formik.setFieldValue('amount', value)}
            />
            <PersonField
                label="Van"
                value={formik.values.sender}
                setValue={(id) => formik.setFieldValue('sender', id)}
            />
            <PersonField
                label="Naar"
                value={formik.values.receiver}
                setValue={(id) => formik.setFieldValue('receiver', id)}
            />
        </ModelInstanceForm>
    );
}
