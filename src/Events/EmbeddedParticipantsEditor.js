// import { Chip, Skeleton, Stack } from "@mui/material";


// export default function EmbeddedParticipantsEditor({ event }) {
//     const { isLoading, isError, data, error } = useQuery({ queryKey: ['persons'], queryFn: getPersonsFn })

//     const persons = data.data;

//     const eventParticipants = event.event_participants;

//     const eventParticipantPersonIds = eventParticipants.map((participant) => participant.participant);

//     if (isLoading || isError) {
//         return <Skeleton />
//     }

//     const eventParticipantPersons = data.data.filter(person => eventParticipantPersonIds.includes(person.id));

//     return (
//         <>
//             <Stack direction="row" spacing={1}>
//                 {eventParticipantPersons.map((person) => {
//                     return <Chip size="small" key={person.id} label={`${person.name}`} onDelete={handleDelete} />
//                 })}
//                 <Chip size="small" icon={<AddIcon />} onClick={handleAddParticipant} label="Add" variant="outlined" color="success" />
//                 <Chip size="small" label={getDate()} color="primary" />
//             </Stack>
//             {pickerOpen ? <ParticipantsPicker open={pickerOpen} event={currentEvent} handleEditorClose={handleEditorClose} /> : <></>}
//         </>
//     )
// }

import { useTheme } from "@emotion/react";
import ParticipantsList from "./ParticipantList";
import { AppBar, Button, Dialog, IconButton, Skeleton, Slide, Toolbar, Typography, useMediaQuery } from "@mui/material";
import React from "react";

import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPersonsFn } from "../Persons/PersonsApiQueries";
import axios from "axios";

import apiPath from "../Api/ApiPath";


const TransitionRight = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

export default function EmbeddedParticipantsEditor({ event, handleEditorClose }) {
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
  
    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
  
      setChecked(newChecked);
    };
    
    

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
        return <Skeleton />
    } else {
        return <ParticipantsList eventParticipants={event.event_participants} handleToggle={handleToggle} checked={checked} persons={persons} />
    }
}
