import logo from './logo.svg';
import './App.css';
//import ShoppingListForm from './shoppinglist'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
//import BrandList from './brandsList';
import { Typography, Paper, Container, Box } from '@mui/material';
import ButtonAppBar from './MyAppBar'
import ProductTable from './productsTable'

import EventItem from './EventItem';
import React, { useState } from "react";

import EventController from './Events/EventController';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});



function App() {
  let events = [
    {
      "name": "Diner",
      "date": "27-feb-2022",
      "participants": ["Cas", "Rutger"]
    },
    {
      "name": "Diner",
      "date": "28-feb-2022",
      "participants": ["Julian", "Jelle"]
    },
    {
      "name": "Diner",
      "date": "29-feb-2022",
      "participants": ["Cas", "Rutger"]
    }
  ]

  return (
    <div className="App">
      {
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      /* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>

          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        < BrandList />
        <QRCodeView />
      </header>
       */}
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <EventController />
        {/* <ButtonAppBar />



        <Container maxWidth="sm">
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <ProductsForm />
          </Box>
          </Container> */}
      </ThemeProvider> 


    </div>
  );
}

// <Paper sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} elevation={2}>
// </Paper>

// <Container maxWidth="sm">
//       {/* <Paper sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} elevation={2}>
//         <Typography component="h1" variant="h4" align="left">
//             Scan
//         </Typography>


//         </Paper> */}
//         {events.map(event => (
//             <EventItem event={event}/>
//         ))}
//         </Container>

export default App;
