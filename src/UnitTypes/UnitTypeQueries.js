import { useQuery } from "@tanstack/react-query";

import ax from "../Api/axios";

const unitTypesQueryKey = "unittypes";

export const getUnitTypesFn = async () => {
    return await ax.get('unittypes/');
};


export function useUnitTypes() {
    const { isLoading, isError, error, data } = useQuery({ queryKey: [unitTypesQueryKey] });
    const actualData = data || [];
    const getUnitType = (id) => {
        const matches = actualData.filter((item) => id === item.id);
        return matches[0] || null;
    };
    return { isLoading, isError, error, data: actualData, getUnitType };
}
