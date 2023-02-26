import React, { useState, useEffect } from 'react';
import { TransitionGroup } from 'react-transition-group';
// import IconButton from '@mui/material/IconButton';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

import axios from 'axios';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Collapse, Button, ListItemAvatar, Avatar, Divider} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function BrandList() {
  const [brands, setBrands] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/legacy/brands/')
      .then(response => setBrands(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleEditClick = (id) => {
    setEditing(id);
  };

  const handleCancelClick = () => {
    setEditing(null);
  };

  const handleSaveClick = (id, newName) => {
    axios.put(`http://localhost:8000/legacy/brands/${id}/`, { name: newName })
      .then(() => {
        setEditing(null);
        setBrands(brands.map(brand => brand.id === id ? { ...brand, name: newName } : brand));
      })
      .catch(error => console.error(error));
  };

  const handleDeleteClick = (id) => {
    axios.delete(`http://localhost:8000/legacy/brands/${id}/`)
      .then(() => {
        setBrands(brands.filter(brand => brand.id !== id));
      })
      .catch(error => console.error(error));
  };

  const handleNameChange = (id, newName) => {
    setBrands(brands.map(brand => brand.id === id ? { ...brand, name: newName } : brand));
  };

  return (
    <List>
        <TransitionGroup>
      {brands.map(brand => (
        <Collapse key={brand.id}>
        <ListItem key={brand.id}>
        <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Albert_Heijn_Logo.svg/1956px-Albert_Heijn_Logo.svg.png" />
        </ListItemAvatar>
          {editing === brand.id ?
            <>
              
              <TextField
                value={brand.name}
                onChange={(event) => handleNameChange(brand.id, event.target.value)}
                variant="standard"
              />
              <ListItemSecondaryAction>
                <Button onClick={() => handleSaveClick(brand.id, brand.name)}>
                  Save
                </Button>
                <Button onClick={handleCancelClick} color="error">
                  Cancel
                </Button>
              </ListItemSecondaryAction>
            </>
            :
            <>
              <ListItemText primary={brand.name} />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleEditClick(brand.id)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(brand.id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </>
          }  
        </ListItem>
        <Divider variant="inset" component="li" />
        </Collapse>
      ))}
      </TransitionGroup>
    </List>
  );
}

export default BrandList;
