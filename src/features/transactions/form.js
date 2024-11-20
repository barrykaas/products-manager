import { useState } from "react";
import { Delete, Save } from "@mui/icons-material";
import { Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useConfirm } from "material-ui-confirm";

import DateField from "../../components/form/DateField";
import { PersonField } from "../persons";
import CurrencyField from "../../components/form/CurrencyField";
import { useTransactionDeleter, useTransactionMutation } from "./api";


const emptyForm = () => ({
    date: new Date(),
    amount: '',
    description: '',
});


export function TransactionForm({ initialTransaction, onSuccess, onSuccessfulDelete }) {
    const existing = !!initialTransaction.id;
    const [editStatus, setEditStatus] = useState();
    const mutator = useTransactionMutation({
        onSuccess: () => {
            setEditStatus('success');
            setTimeout(() => setEditStatus(undefined), 1000);
            if (onSuccess) onSuccess();
        },
        onError: () => {
            setEditStatus('error');
            setTimeout(() => setEditStatus(undefined), 1000);
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
        <Stack
            component="form"
            spacing={2}
            sx={{ p: 2 }}
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

            <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                color={editStatus}
            >
                {existing ? 'Update' : 'Opslaan'}
            </Button>
            {existing &&
                <Button
                    variant="contained"
                    startIcon={<Delete />}
                    color="error"
                    onClick={onDelete}
                >
                    Verwijder
                </Button>
            }
        </Stack>
    );
}
