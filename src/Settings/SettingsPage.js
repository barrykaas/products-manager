import { useCookies } from "react-cookie";
import { Stack, Typography } from "@mui/material";

import { PersonsIdField } from "../Persons/PersonsField";


export default function SettingsPage() {
    const [cookies, setCookie] = useCookies(["user"]);

    return (
        <Stack component="form">
            <Typography variant="h6">Wie ben je?</Typography>
            <PersonsIdField
                label="Kies gebruiker"
                value={cookies?.user && Number(cookies.user)}
                setValue={(userId) => setCookie(
                    "user", userId, { expires: new Date("2030-01-01T00:00:00Z") }
                )}
            />
        </Stack>
    );
}

export function useSettings() {
    const [cookies] = useCookies([
        "user"
    ]);

    return {
        userId: cookies?.user && Number(cookies.user),
    };
}
