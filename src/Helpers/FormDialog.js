import React from 'react';
import { AppBar, Dialog, IconButton, Slide, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Delete } from '@mui/icons-material';


const TransitionRight = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function FormDialog({ open, onClose, onDelete, title, secondaryButtons, hasToolbar = true, children }) {
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
      {hasToolbar &&
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography flex={1} variant="h6" component="div" noWrap>
              {title}
            </Typography>

            {secondaryButtons}

            {onDelete &&
              <IconButton
                color="error"
                onClick={onDelete}
              >
                <Delete />
              </IconButton>
            }
          </Toolbar>
        </AppBar>
      }
      {children}
    </Dialog>
  );
}

export default FormDialog;