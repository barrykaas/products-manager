import { useQuery, useQueryClient } from "@tanstack/react-query";


export const personsQueryKey = 'persons';

export const usePersons = () => {
    const queryClient = useQueryClient();
    const { isError, error, isLoading, data } = useQuery({ queryKey: [personsQueryKey] });
    const actualData = data || [];
    const getPerson = (id) => {
        const matches = actualData.filter((item) => id === item.id);
        return matches[0] || null;
    };
    const invalidate = () => queryClient.invalidateQueries({ queryKey: [personsQueryKey] });
    return { isError, error, isLoading, data: actualData, getPerson, invalidate };
};
