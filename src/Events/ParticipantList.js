import { Chip, Grid } from "@mui/material";
import React from "react";

import SelectPersons from "../Persons/SelectPersons";


const participantPresets = [
    { name: "Kaasfood", participants: [1, 2, 4, 5] },
    { name: "🧀 Met Cas ", participants: [1, 2, 3, 4, 5] },
    { name: "🇮🇹 Met Frans", participants: [1, 2, 4, 5, 6] },
    { name: "😩 Zonder Thijmen", participants: [1, 2, 5] },
    { name: "❤️ Thijmen & Jelle", participants: [4, 5] },
];

export default function ParticipantsList({ setChecked, checked }) {
    return (
        <>
            <Grid container spacing={1} margin={1} width={1}>
                {participantPresets.map((preset, index) => (
                    <Grid item key={index}>
                        <Chip
                            label={preset.name}
                            onClick={() => setChecked([...preset.participants])}
                        />
                    </Grid>
                ))}
            </Grid>
            <SelectPersons
                selected={checked}
                setSelected={setChecked}
            />
        </>
    );
}
