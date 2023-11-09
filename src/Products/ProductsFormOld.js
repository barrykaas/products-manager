
import React, { useState, useEffect } from "react";

import ReactDOM from 'react-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import getToken from "../apiForAH";
import ProductCard from "../ProductsSummary";
import BarcodeScanner from "../BarcodeScanner";

import apiPath from "../Api/ApiPath";

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
    fetch(`${apiPath}/brands/`)
      .then(response => response.json())
      .then(data => setBrands(data))
      .catch(error => console.error(error));
  }, []);

  return (

    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={brands.map(element => element.name)}
      renderInput={(params) => <TextField {...params} label="Merk" />}
    />
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const styles = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  prevButton: {
    marginRight: 'auto',
  },
  nextButton: {
    marginLeft: 'auto',
  },
};

const ProductsForm = () => {
  const [barcode, setBarcode_] = useState(null);

  const [product, setProduct] = useState(null);

  const [formState, setFormState] = useState(0);

  const nextPage = () => {
    setFormState(formState+1);
  };

  const handleChange = (event, newValue) => {
    setFormState(newValue);
  };

  const [data, setData] = useState(null);

  const setBarcode = (barcode) => {
    setBarcode_(barcode);
    
    async function fetchData(barcode) {
      const response = await fetch(`${apiPath}/products/?barcode=${barcode}`);
      const data = await response.json();
      if(data['count'] === 0) {
        //setProducts()
        setProduct(null);
      } else if (data['count'] === 1) {
        setProduct(data['results'][0]);
        setFormState(3);
      }
      
    }
  
    fetchData(barcode);
  }


  return (
    <div>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={formState} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Scan" {...a11yProps(0)} />
          <Tab label="Merk" {...a11yProps(1)} />
          <Tab label="Type" {...a11yProps(2)} />
          <Tab label="Summary" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={formState} index={0}>
        <BarcodeScanner setBarcode={setBarcode}/>
      </TabPanel>
      <TabPanel value={formState} index={1}>
        BarcodeScanner
      </TabPanel>
      <TabPanel value={formState} index={2}>
        Type
      </TabPanel>
      <TabPanel value={formState} index={3}>    
        {
          product ? (
            <ProductCard product={product} />
          ) : (
            <p>Not found</p>
          )}
      </TabPanel>
      <div style={styles.buttonContainer}>
        <Button
         
         
          style={styles.prevButton}
        >
          Previous
        </Button>
        <Button
          
          onClick={nextPage}
          style={styles.nextButton}
        >
          Next
        </Button>
      </div>
      
      {/* {data ? (
        <p>Received data: {JSON.stringify(data)}</p>
      ) : (
        <p>Loading data...</p>
      )} */}
    </div>
  );
};

const BrandPartForm = () => {
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
