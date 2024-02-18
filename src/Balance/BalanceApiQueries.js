import { useQuery, useQueryClient } from "@tanstack/react-query";

import ax from "../Api/axios";


const balancesQueryKey = 'balances';

const getBalancesFn = async () => {
    return await ax.get('balances/');
};

export const useBalances = () => {
    const queryClient = useQueryClient();
    const { isError, error, isLoading, data } = useQuery({ queryKey: [balancesQueryKey], queryFn: getBalancesFn });
    const actualData = data?.data || [];
    const getPerson = (id) => {
        const matches = actualData.filter((item) => id === item.id);
        return matches[0] || null;
    };
    const invalidate = () => queryClient.invalidateQueries({ queryKey: [balancesQueryKey] });
    return {isError, error, isLoading, data: actualData, getPerson, invalidate};
};
