import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import ax from "../Api/axios";

export const brandsQueryKey = "brands";

export const getBrandsFn = async () => {
    return ax.get('brands/');
};

export const deleteBrandFn = async (itemId) => {
    const data = await ax.delete(`brands/${itemId}/`);
    return data;
};

export const addBrandFn = async (data) => {
    return ax.post('brands/', data);
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
