import { useTheme } from "@emotion/react";
import { Box, Dialog, Slide, useMediaQuery } from "@mui/material";
import { forwardRef } from "react";


const TransitionRight = forwardRef(
    (props, ref) => <Slide
        direction="left"
        ref={ref}
        {...props}
    />
);

export default function DialogWindow({
    onClose,
    children,
    ...props
}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth
            TransitionComponent={TransitionRight}
            onClose={onClose}
            PaperComponent={Box}
            PaperProps={{
                sx: { bgcolor: 'background.paper' }
            }}
            {...props}
        >
            {children}
        </Dialog>
    );
}
