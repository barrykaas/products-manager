import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import apiPath from "../Api/ApiPath";

const queryKey = "unittypes";

export const getUnitTypesFn = async () => {
    return axios.get(`${apiPath}/unittypes/`);
};


export function useUnitTypes() {
    const {isLoading, isError, error, data} = useQuery([queryKey], getUnitTypesFn);
    const actualData = data?.data || [];
    const getUnitType = (id) => {
        const matches = actualData.filter((item) => id === item.id);
        return matches[0] || null;
    };
    return {isLoading, isError, error, data: actualData, getUnitType};
}
