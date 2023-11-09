import React, { useState } from 'react';
import { Button, Alert, Snackbar } from '@mui/material';
import {EventAppBar, EventAppBarClosable} from './EventAppBar';
import EventsList from './EventsList';
import ParticipantsPicker from './ParticipantsController';
// import ProductsForm from '../Products/ProductsForm';

//import ButtonAppBar from './MyAppBar'


import FormDialog from '../Helpers/FormDialog';
import { EventCreateForm, EventEditForm } from './EventForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useConfirm } from 'material-ui-confirm';

function EventController({handleSelectedEvent, onClose}) {
    const queryClient = useQueryClient()

    const [currentEvent, setCurrentEvent] = useState(null);

    const [messageOpen, setMessageOpen] = useState(false);

    const [messageText, setMessageText] = useState("");
    const [messageState, setMessageState] = useState(true);

    const [editOpen, setEditOpen] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);


    const handleEditParticipants = (event) => {
        setCurrentEvent(event);
        setEditOpen(true);
    };

    const handleAddEvent = () => {
        setCreateOpen(true)
    }

    const didSuccesfullyCreate = (message) => {
        setCreateOpen(false);
        setMessageOpen(true);
        setMessageText(message);
    }

    const didSuccesfullyEdit = (message) => {
        setEditOpen(false);
        setMessageOpen(true);
        setMessageText(message);
    }

    const confirm = useConfirm();

    const deleteParticipantMutation = useMutation({
        mutationFn: async (itemId) => {
             const data = await axios.delete(`https://django.producten.kaas/api/events/${itemId}/`)
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

    const handleRemoveClick = (event) => {
        confirm({ description: `Verwijderen van ${event.name}` })
            .then(() => {
                deleteParticipantMutation.mutate(event.id)
                didSuccesfullyEdit("Verwijderd!")
            })
            .catch(() => {
                
            });
    }


    return (
        <>
            <Snackbar open={messageOpen} autoHideDuration={1500} onClose={() => setMessageOpen(false)}>
                <Alert severity={messageState ? "success" : "error"} sx={{ width: '100%' }}>
                    {messageText}
                </Alert>
            </Snackbar>
            {onClose ? 
            <EventAppBarClosable onClose={onClose} title={"Events"} onAdd={handleAddEvent} /> :
            <EventAppBar title={"Events"} onAdd={handleAddEvent} /> 
            }
            <EventsList handleEdit={handleEditParticipants} handleSelectedEvent={handleSelectedEvent} />

            <FormDialog title={"Events"} open={createOpen} onClose={() => setCreateOpen(false)}>
                <EventCreateForm didSuccesfullyCreate={didSuccesfullyCreate} />
            </FormDialog>

            {currentEvent ? 
            <FormDialog title={"Events"} open={editOpen} onClose={() => setEditOpen(false)} secondaryButtons={
                <Button variant="contained" color={"error"} onClick={() => handleRemoveClick(currentEvent)} >Remove</Button>
            }>
                <EventEditForm didSuccesfullyEdit={didSuccesfullyEdit} item={currentEvent}/>
            </FormDialog>
            : <></>
        }

        </>
    );
}

export default EventController;
