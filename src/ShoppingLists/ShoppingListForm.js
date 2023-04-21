import { useFormik } from 'formik';
import { Button, Box, TextField, Stack, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

import * as yup from 'yup';
import { useEffect, useState } from 'react';

const validationSchema = yup.object({
    transactionDate: yup
        .date('Enter transaction date')
        .required('Transaction date is required'),
    type: yup
        .string('Enter transaction type')
        .required('Transaction type is required'),
    name: yup
        .string('Enter name')
        .required('Name is required'),
});

export default function ShoppingListForm({handleFormSubmit}) {
    const formik = useFormik({
        initialValues: {
            transactionDate: new Date(),
            type: 2,
            name: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleFormSubmit(values);
        },
    });

    const [listTypes, setListTypes] = useState([]);

    useEffect(() => {
        fetch('https://django.producten.kaas/api/listtypes')
            .then(response => response.json())
            .then(data => setListTypes(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <Box sx={{ p: 2, height: 1, width: 1 }}>
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
                <TextField
                    fullWidth
                    id="transactionDate"
                    name="transactionDate"
                    label="Transaction Date"
                    type="date"
                    value={formik.values.transactionDate}
                    onChange={formik.handleChange}
                    error={
                        formik.touched.transactionDate && Boolean(formik.errors.transactionDate)
                    }
                    helperText={
                        formik.touched.transactionDate && formik.errors.transactionDate
                    }
                />
                <TextField
                    className="px-2 my-2"
                    variant="outlined"
                    name="type"
                    id="type"
                    select
                    label="Type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    fullWidth
                    error={
                        formik.touched.type &&
                        Boolean(formik.errors.type)
                    }
                    helperText={
                        formik.touched.type && formik.errors.type
                    }
                >
                    {listTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                            {type.type}
                        </MenuItem>
                    ))}
                </TextField>

                <Button color="primary" variant="contained" fullWidth type="submit">
                    Save
                </Button>
            </Stack>
        </Box>
    );
};
