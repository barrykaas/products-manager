import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";

import ax from "../Api/axios";
import { scannedItemsQueryKey } from "../ScannedItems/ScannedItemsApiQueries";


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

const fetchProductsAndSearchFn = async (pageParam = 0, searchQuery) => {
    const urlParams = {};
    if (searchQuery) urlParams.search = searchQuery;

    let res
    if (pageParam === 0) {
        res = await ax.get('products/', { params: urlParams });
    } else {
        res = await ax.get(pageParam);
    }
    return res.data;
}


export function useProducts(searchQuery) {
    return useInfiniteQuery({
        queryKey: ['products', searchQuery],
        queryFn: ({ pageParam = 0 }) => fetchProductsAndSearchFn(pageParam, searchQuery),
        getNextPageParam: (lastPage, pages) => lastPage.next,
    });
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
