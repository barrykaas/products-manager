import { Checkbox, FormControlLabel, Stack } from "@mui/material";

import { PersonField } from "src/features/persons";
import Page from 'src/components/ui/Page';
import { useSettings } from "src/hooks/useSettings";
import { MarketField } from "src/features/markets";


export default function Settings() {
    const [settings, updateSettings] = useSettings();

    return (
        <Page
            title="Instellingen"
        >
            <Stack component="form" spacing={2} sx={{ m: 2 }}>
                <PersonField
                    label="Gebruiker"
                    value={settings.userId}
                    setValue={(userId) => updateSettings({ userId })}
                    TextFieldProps={{ required: true }}
                />
                <MarketField
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
        </Page >
    );
}
