import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import apiPath from "../Api/ApiPath";


export const getUnitTypesFn = async () => {
    return axios.get(`${apiPath}/unittypes/`);
};


export function useUnitTypes() {
    const {isLoading, isError, error, data} = useQuery(["unittypes"], getUnitTypesFn);
    const actualData = data?.data || [];
    return {isLoading, isError, error, data: actualData};
}
