import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import apiPath from "../Api/ApiPath";

export const brandsQueryKey = "brands";

export const getBrandsFn = async () => {
    return axios.get(`${apiPath}/brands/`)
};

export const useBrands = () => {
    return useQuery({ queryKey: [brandsQueryKey], queryFn: getBrandsFn })
};


export const deleteBrandFn = async (itemId) => {
    const data = await axios.delete(`${apiPath}/brands/${itemId}/`);
    return data;
};

export const addBrandFn = async (data) => {
    return axios.post(`${apiPath}/brands/`, data);
};
