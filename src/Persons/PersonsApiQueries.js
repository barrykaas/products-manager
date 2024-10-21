import { useQuery, useQueryClient } from "@tanstack/react-query";

import { apiLocations } from "../Api/Common";


export const usePersons = () => {
    const queryClient = useQueryClient();
    const { isError, error, isLoading, data } = useQuery({ queryKey: [apiLocations.persons] });
    const actualData = data || [];
    const getPerson = (id) => {
        const matches = actualData.filter((item) => id === item.id);
        return matches[0] || null;
    };
    const invalidate = () => queryClient.invalidateQueries({ queryKey: [apiLocations.persons] });
    return { isError, error, isLoading, data: actualData, getPerson, invalidate };
};
