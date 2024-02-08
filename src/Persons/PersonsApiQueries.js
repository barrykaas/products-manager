import { useQuery, useQueryClient } from "@tanstack/react-query";

import ax from "../Api/axios";
import { useInvalidator } from "../Api/Common";


const personsQueryKey = 'persons';

const getPersonsFn = async () => {
    return await ax.get('persons/');
};

export const usePersons = () => {
    const queryClient = useQueryClient();
    const { isError, error, isLoading, data } = useQuery({ queryKey: [personsQueryKey], queryFn: getPersonsFn });
    const actualData = data?.data || [];
    const getPerson = (id) => {
        const matches = actualData.filter((item) => id === item.id);
        return matches[0] || null;
    };
    const invalidate = () => queryClient.invalidateQueries({ queryKey: [personsQueryKey] });
    return {isError, error, isLoading, data: actualData, getPerson, invalidate};
};
