import { Checkbox, FormControlLabel, Stack } from "@mui/material";

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
            <Stack component="form" spacing={2} sx={{ m: 2 }}>
                <PersonsIdField
                    label="Gebruiker"
                    value={settings.userId}
                    setValue={(userId) => updateSettings({ userId })}
                    TextFieldProps={{ required: true }}
                />
                <MarketIdField
                    label="Default winkel"
                    value={settings.defaultMarket}
                    setValue={(defaultMarket) => updateSettings({ defaultMarket })}
                />
                <FormControlLabel
                    label="Info voor nerds"
                    control={
                        <Checkbox
                            checked={settings.nerdInfo}
                            onChange={(event) => updateSettings({ nerdInfo: event.target.checked })}
                        />
                    }
                />
            </Stack>
        </ControllerView >
    );
}
