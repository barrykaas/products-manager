import { useQuery } from "@tanstack/react-query";

import ax from "../Api/axios";


const marketsQueryKey = 'markets';

export const getMarketsFn = async () => {
    return await ax.get('markets/');
};

export const useMarkets = () => {
    const { isError, error, isLoading, data } = useQuery({ queryKey: [marketsQueryKey], queryFn: getMarketsFn });
    const actualData = data?.data || [];
    const getMarket = (id) => {
        const matches = actualData.filter((item) => id === item.id);
        return matches[0] || null;
    };
    return {isError, error, isLoading, data: actualData, getMarket};
};
