import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import apiPath from "../Api/ApiPath";


const personsQueryKey = 'persons';

export const getPersonsFn = async () => {
    return axios.get(`${apiPath}/persons/`);
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
