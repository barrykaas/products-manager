import { useCookies } from "react-cookie";
import { Stack, Typography } from "@mui/material";

import { PersonsIdField } from "../Persons/PersonsField";
import ControllerView from "../Helpers/ControllerView";


export default function SettingsPage({ onMenu }) {
    const [cookies, setCookie] = useCookies(["user"]);

    return (
        <ControllerView
            title="Instellingen"
            onMenu={onMenu}
        >
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
        </ControllerView>
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
