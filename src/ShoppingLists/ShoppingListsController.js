import React, {useState} from 'react';
import { Typography, AppBar, Toolbar, IconButton, Button, Dialog } from '@mui/material';
import ShoppingListsAppBar from './ShoppingListsAppBar';
import Slide from '@mui/material/Slide';
import ShoppingListForm from './ShoppingListForm';
import CloseIcon from '@mui/icons-material/Close';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function ShoppingsListsController() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFormSubmit = async (data) => {
        data['transaction_date'] = data['transactionDate'];
        delete data['transactionDate'];
        alert(JSON.stringify(data));
        const url = 'https://django.producten.kaas/api/lists/';
        const config = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            console.log(data);
            setOpen(false);
            // Handle success response
        } catch (error) {
            console.error(error);
            // Handle error response
        }
        
    };

    return (
        <>
            <ShoppingListsAppBar handleAddButton={handleClickOpen} />
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Voeg lijst toe
                        </Typography>
                        {/* <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button> */}
                    </Toolbar>
                </AppBar>
                <ShoppingListForm handleFormSubmit={handleFormSubmit} />
            </Dialog>
        </>
    );
}

export default ShoppingsListsController;

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

// <AppBar sx={{ position: 'relative' }}>
//                 <Toolbar>
//                     <IconButton
//                     edge="start"
//                     color="inherit"
//                     onClick={handleClose}
//                     aria-label="close"
//                     >
//                     <CloseIcon />
//                     </IconButton>
//                     <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
//                     Sound
//                     </Typography>
//                     <Button autoFocus color="inherit" onClick={handleClose}>
//                     save
//                     </Button>
//                 </Toolbar>
//             </AppBar>
//             <List>
//             <ListItem button>
//                 <ListItemText primary="Phone ringtone" secondary="Titania" />
//             </ListItem>
//             <Divider />
//             <ListItem button>
//                 <ListItemText
//                 primary="Default notification ringtone"
//                 secondary="Tethys"
//                 />
//             </ListItem>
//             </List>