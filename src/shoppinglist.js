import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@mui/material/Collapse';
//import { DeleteIcon } from '@mui/icons-material';
//import IconButton from '@mui/material/IconButton';

function ShoppingListForm() {
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [productType, setProductType] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShoppingList([...shoppingList, { price, amount, productType }]);
    setPrice("");
    setAmount("");
    setProductType("");
    setOpen(false);
  };

  const handleRemoveItem = (index) => {
    var array = [...shoppingList];
    array.splice(index, 1);
    setShoppingList(array);
  }

  return (
   
    <Container maxWidth="sm">
      <Box>
        <Typography variant="h4">Shopping List</Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
      >
        Add Product
      </Button>
      
    


      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Product</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <TextField
              label="Amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <TextField
              label="Product Type"
              type="text"value={productType}
              onChange={(e) => setProductType(e.target.value)}
              />
              </form>
              </DialogContent>
              <DialogActions>
              <Button onClick={handleClose} color="primary">
              Cancel
              </Button>
              <Button onClick={handleSubmit} color="primary">
              Add
              </Button>
              </DialogActions>
              </Dialog>
              
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <TransitionGroup>
              {shoppingList.map((product, index) => (
                <Collapse key={index}>
              <ListItem>
              <ListItemText
              primary={`Price: ${product.price}`}
              secondary={`Amount: ${product.amount} - Type: ${product.productType}`}
              />
              <IconButton
                edge="end"
                aria-label="delete"
                title="Delete"
                onClick={() => handleRemoveItem(index)}
              ><DeleteIcon/>
              </IconButton>
              </ListItem>
              </Collapse>
              ))}
              </TransitionGroup>
              </List>
              
              
              </Container>
              
              );
              }
              
              export default ShoppingListForm;