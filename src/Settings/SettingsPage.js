import { Stack, Typography } from "@mui/material";

import { PersonsIdField } from "../Persons/PersonsField";
import ControllerView from "../Helpers/ControllerView";
import { MarketIdField } from "../Markets/MarketField";
import { useSettings } from "./settings";


export default function SettingsPage({ onMenu }) {
    const [settings, updateSettings] = useSettings();

    return (
        <ControllerView
            title="Instellingen"
            onMenu={onMenu}
        >
            <Stack component="form">
                <Typography variant="h6">Wie ben je?</Typography>
                <PersonsIdField
                    label="Kies gebruiker"
                    value={settings.userId}
                    setValue={(userId) => updateSettings({ userId })}
                />
                <Typography variant="h6">Default winkel</Typography>
                <MarketIdField
                    // label="Kies gebruiker"
                    value={settings.defaultMarket}
                    setValue={(defaultMarket) => updateSettings({ defaultMarket })}
                />
            </Stack>
        </ControllerView>
    );
}
