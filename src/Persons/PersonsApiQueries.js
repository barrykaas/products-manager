import { useQuery } from "@tanstack/react-query";

import ax from "../Api/axios";


const personsQueryKey = 'persons';

export const getPersonsFn = async () => {
    return await ax.get('persons/');
};

export const usePersons = () => {
    const { isError, error, isLoading, data } = useQuery({ queryKey: [personsQueryKey], queryFn: getPersonsFn });
    const actualData = data?.data || [];
    const getPerson = (id) => {
        const matches = actualData.filter((item) => id === item.id);
        return matches[0] || null;
    };
    return {isError, error, isLoading, data: actualData, getPerson};
};
