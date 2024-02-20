import { useMutation, useQueryClient } from "@tanstack/react-query";

import ax from "../Api/axios";
import { scannedItemsQueryKey } from "../ScannedItems/ScannedItemsApiQueries";
import { useInvalidator, usePaginatedQuery } from "../Api/Common";


export const productsQueryKey = "products";

const mutateProductFn = async (item) => {
    if (item.id) {
        return await ax.patch(`products/${item.id}/`, item);
    } else {
        return await ax.post('products/', item);
    }
};

const deleteProductFn = async (itemId) => {
    return await ax.delete(`products/${itemId}/`);
};


export function useProducts(searchQuery) {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    return usePaginatedQuery({ queryKey: [productsQueryKey, null, params] });
}

export function useProductMutator({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const mutateProduct = useMutation({
        mutationFn: mutateProductFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [productsQueryKey] });
            queryClient.invalidateQueries({ queryKey: [scannedItemsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return mutateProduct.mutate;
}

export function useProductDeleter({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteProductFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [productsQueryKey] });
            queryClient.invalidateQueries({ queryKey: [scannedItemsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return deleteMutation.mutate;
}

export const useProductsInvalidator = () => useInvalidator(productsQueryKey);
