import { useCookies } from "react-cookie";


const settingsCookies = {
    userId: "user",
    defaultMarket: "defaultMarket"
};

export function useSettings() {
    const [cookies, setCookie] = useCookies(
        Object.values(settingsCookies)
    );

    const updateSettings = (newSettings) => {
        for (const setting in newSettings) {
            setCookie(
                settingsCookies[setting],
                newSettings[setting],
                { expires: new Date("2030-01-01T00:00:00Z") }
            )
        }
    };

    return [
        {
            userId: cookies?.user && Number(cookies.user),
            defaultMarket: cookies?.defaultMarket && Number(cookies.defaultMarket)
        },
        updateSettings
    ];
}
