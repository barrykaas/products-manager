import apiPath from "../Api/ApiPath";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getBrandsFn = async () => {
    return axios.get(`${apiPath}/brands/`)
};

export const useBrands = () => {
    return useQuery({ queryKey: ['brands'], queryFn: getBrandsFn })
};
