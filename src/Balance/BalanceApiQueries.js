import { useQuery, useQueryClient } from "@tanstack/react-query";


const balancesQueryKey = 'balances';

export const useBalances = () => {
    const queryClient = useQueryClient();
    const { isError, error, isLoading, data } = useQuery({ queryKey: [balancesQueryKey] });
    const actualData = data || [];
    const getPerson = (id) => {
        const matches = actualData.filter((item) => id === item.id);
        return matches[0] || null;
    };
    const invalidate = () => queryClient.invalidateQueries({ queryKey: [balancesQueryKey] });
    return {isError, error, isLoading, data: actualData, getPerson, invalidate};
};
