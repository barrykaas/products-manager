import { useState, useEffect } from "react";


const settingsKey = 'kpSettings';

function getStorageValue(key, defaultValue) {
    const saved = localStorage.getItem(key);
    const initial = JSON.parse(saved);
    return initial || defaultValue;
}

export const useSettings = () => {
    const [settings, setSettings] = useState(() => {
        return getStorageValue(settingsKey, {});
    });
    const updateSettings = (newSettings) => setSettings({
        ...settings,
        ...newSettings
    });

    useEffect(() => {
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    }, [settings]);

    return [settings, updateSettings];
};
