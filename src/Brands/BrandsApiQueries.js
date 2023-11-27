import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import apiPath from "../Api/ApiPath";


export const brandsQueryKey = "brands";

export const getBrandsFn = async () => {
    return axios.get(`${apiPath}/brands/`)
};

export const deleteBrandFn = async (itemId) => {
    const data = await axios.delete(`${apiPath}/brands/${itemId}/`);
    return data;
};

export const addBrandFn = async (data) => {
    return axios.post(`${apiPath}/brands/`, data);
};


export const useBrands = () => {
    const { isError, error, isLoading, data } = useQuery({ queryKey: [brandsQueryKey], queryFn: getBrandsFn });
    const actualData = data?.data || [];
    const getBrand = (id) => {
        const matches = actualData.filter((brand) => id === brand.id);
        return matches[0] || null;
    };
    return {isError, error, isLoading, data: actualData, getBrand};
};

export function useBrandDeleter({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const deleteBrandMutation = useMutation({
        mutationFn: deleteBrandFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [brandsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return deleteBrandMutation.mutate;
};

export function useBrandAdder({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const addBrandMutation = useMutation({
        mutationFn: addBrandFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [brandsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return addBrandMutation.mutate;
};
