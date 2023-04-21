import React from 'react';
import { Typography, Paper, Container, Box } from '@mui/material';
import EventAppBar from './EventAppBar';
import EventsList from './EventsList';
// import ProductsForm from '../Products/ProductsForm';

//import ButtonAppBar from './MyAppBar'

function EventController() {
    return (
        <>
            <EventAppBar />
            <EventsList />
          
        </>
    );
}

export default EventController;

//   {/* <Container maxWidth="sm">
            
                
                
//                 {/* <EventsList /> */}
//                 <Box
//                     sx={{
//                         marginTop: 2,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                     }}
//                 >
//                     {/* <ProductsForm /> */}
//                 </Box>
                
//             </Container> */}