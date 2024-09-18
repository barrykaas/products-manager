import { useCookies } from "react-cookie";


const settingsCookie = 'kaasproductenSettings';

export function useSettings() {
    const [cookies, setCookie] = useCookies();
    const settings = cookies[settingsCookie] ?? {};

    const updateSettings = (newSettings) => {
        newSettings = {
            ...settings,
            ...newSettings
        };
        setCookie(
            settingsCookie,
            JSON.stringify(newSettings),
            { expires: new Date("2030-01-01T00:00:00Z") }
        )
    };

    return [settings, updateSettings];
}
