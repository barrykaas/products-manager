import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import apiPath from "../Api/ApiPath";

export const getBrandsFn = async () => {
    return axios.get(`${apiPath}/brands/`)
};

export const useBrands = () => {
    return useQuery({ queryKey: ['brands'], queryFn: getBrandsFn })
};

export const deleteBrand = async (itemId) => {
    const data = await axios.delete(`${apiPath}/products/${itemId}/`);
    return data;
}
