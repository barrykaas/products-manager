// import React from 'react';
// import { Formik, Form, Field } from 'formik';
// import TextField from '@material-ui/core/TextField';
// import { useFormik } from 'formik';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';

// const initialValues = {
//   id: '',
//   name: '',
//   unit_number: '',
//   unit_weightvol: '',
//   unit_price: '',
//   unit_type: '',
//   date_added: '',
//   brand: '',
//   barcode: '',
//   image: '',
//   category: ''
// };

// const onSubmit = (values) => {
//   // send the values to the REST API endpoint
//   fetch('https://example.com/api/endpoint', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(values)
//   })
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error(error));
// };

// const FormikForm = () => (
//   <Formik
//     initialValues={initialValues}
//     onSubmit={onSubmit}
//   >
//     {({ values, handleChange, handleBlur, handleSubmit }) => (
//       <Form onSubmit={handleSubmit}>
//         <Field name="id">
//           {({ field }) => (
//             <TextField label="ID" {...field} />
//           )}
//         </Field>
//         <Field name="name">
//           {({ field }) => (
//             <TextField label="Name" {...field} />
//           )}
//         </Field>
//         <Field name="unit_number">
//           {({ field }) => (
//             <TextField label="Unit Number" {...field} />
//           )}
//         </Field>
//         <Field name="unit_weightvol">
//           {({ field }) => (
//             <TextField label="Unit Weight/Vol" {...field} />
//           )}
//         </Field>
//         <Field name="unit_price">
//           {({ field }) => (
//             <TextField label="Unit Price" {...field} />
//           )}
//         </Field>
//         <Field name="unit_type">
//           {({ field }) => (
//             <TextField label="Unit Type" {...field} />
//           )}
//         </Field>
//         <Field name="date_added">
//           {({ field }) => (
//             <TextField label="Date Added" {...field} />
//           )}
//         </Field>
//         <Field name="brand">
//           {({ field }) => (
//             <TextField label="Brand" {...field} />
//           )}
//         </Field>
//         <Field name="barcode">
//           {({ field }) => (
//             <TextField label="Barcode" {...field} />
//           )}
//         </Field>
//         <Field name="image">
//           {({ field }) => (
//             <TextField label="Image" {...field} />
//           )}
//         </Field>
//         <Field name="category">
//           {({ field }) => (
//             <TextField label="Category" {...field} />
//           )}
//         </Field>
//         <Button type="submit" variant="contained" color="primary">Submit</Button>
//       </Form>
//     )}
//   </Formik>
// );

// export default FormikForm;

import React, { useState, useEffect } from "react";

import ReactDOM from 'react-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

function BrandsSearcher() {
  const [brands, setBrands] = useState([]);
  useEffect(() => {
  fetch('https://django.producten.kaas/api/brands/')
  .then(response => response.json())
  .then(data => setBrands(data))
  .catch(error => console.error(error));
}, []);

  return (
    
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={brands.map(element => element.name)}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
  );
}

const ProductsForm = () => {
  const formik = useFormik({
    initialValues: {
      brand: '',
      password: 'foobar',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <BrandsSearcher
          fullWidth
          id="brand"
          name="brand"
          label="brand"
          value={formik.values.brand}
          onChange={formik.handleChange}
          error={formik.touched.brand && Boolean(formik.errors.brand)}
          helperText={formik.touched.brand && formik.errors.brand}
          margin="normal"
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
        />
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ProductsForm;
