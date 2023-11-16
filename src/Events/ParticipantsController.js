import { useTheme } from "@emotion/react";
import ParticipantsList from "./ParticipantList";
import { AppBar, Button, Dialog, IconButton, Skeleton, Slide, Toolbar, Typography, useMediaQuery } from "@mui/material";
import React from "react";

import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPersonsFn } from "./EventsApiQueries";
import axios from "axios";


const TransitionRight = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

function ParticipantsPicker({ event, open, handleEditorClose }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const queryClient = useQueryClient();

    const { isLoading, isError, data, error } = useQuery({ queryKey: ['persons'], queryFn: getPersonsFn })

    const persons = data.data;

    const eventParticipants = event.event_participants;

    const eventParticipantPersonIds = eventParticipants.map((participant) => participant.participant);

    const [checked, setChecked] = React.useState(eventParticipantPersonIds);

    const deleteParticipantMutation = useMutation({
        mutationFn: async (itemId) => {
             const data = await axios.delete(`${apiPath}/eventparticipants/${itemId}/`)
             return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['events']});
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`Error`)
          },
    });

    const addParticipantMutation = useMutation({
        mutationFn: async (newParticipant) => {
             const data = await axios.post(`${apiPath}/eventparticipants/`, newParticipant)
             return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['events']});
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`Error`)
          },
    });
  
    const handleSave = async () => {
        const removable = eventParticipants.filter(element => !checked.includes(element.participant));
        const added = checked.filter(element => !eventParticipantPersonIds.includes(element));

        const removableAsync = removable.map((item) => deleteParticipantMutation.mutateAsync(item.id))
        
        const adderAsync = added.map((participantId) => addParticipantMutation.mutateAsync({'event': event.id, 'participant': participantId}))
        
        const allPromises = removableAsync.concat(adderAsync);
        try {
            await Promise.all(allPromises)
            console.log("success")
            handleEditorClose("Wijzingingen opgeslagen!", true)
        } catch (error) {
            console.error(error)
            handleEditorClose(`Probleem ${error}`, false)
        }
        
    };

    let list;

    if (isLoading || isError) {
        list = <Skeleton />
    } else {
        list = <ParticipantsList handleToggle={setChecked} checked={checked} persons={persons} />
    }



    return (<Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        open={open}
        maxWidth='sm'
        onClose={() => handleEditorClose("No changes", true)}
        TransitionComponent={TransitionRight}
    >
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => handleEditorClose("No changes", true)}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Deelnemers
                </Typography>

                <Button
                   // edge="end"
                    onClick={handleSave}
                    variant="contained"
                >
                    Save
                </Button>

            </Toolbar>
        </AppBar>
        {list}
    </Dialog>)
}

export default ParticipantsPicker;
