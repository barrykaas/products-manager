import React from 'react';
import { AppBar, Dialog, IconButton, Slide, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


const TransitionRight = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function FormDialog({ open, onClose, title, secondaryButtons, hasToolbar = true, children }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth='sm'
      TransitionComponent={TransitionRight}
    >
      { hasToolbar ? 
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          {secondaryButtons}
          {/* <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button> */}


        </Toolbar>
      </AppBar>
:<></>}
      {children}
    </Dialog>
  );
}

export default FormDialog;