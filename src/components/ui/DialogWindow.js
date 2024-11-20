import { useTheme } from "@emotion/react";
import { Dialog, Slide, useMediaQuery } from "@mui/material";
import { forwardRef } from "react";


const TransitionRight = forwardRef(
    (props, ref) => <Slide
        direction="left"
        ref={ref}
        {...props}
    />
);

export default function DialogWindow(props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth
            maxWidth="sm"
            TransitionComponent={TransitionRight}
            {...props}
        />
    );
}
