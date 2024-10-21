import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ax from "./axios";


export const apiLocations = {
    receipts: 'receipts',
    products: 'products',
    brands: 'brands',
    events: 'events',
    unitTypes: 'unit_types',
    scannedItems: 'scanned_items',
    balance: 'balance',
    persons: 'persons',
}

export function useInvalidator(queryKey) {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey });
}

export const defaultQueryFn = async ({ queryKey, pageParam = 1 }) => {
    const path = [...queryKey];
    let params;

    if (typeof path[path.length - 1] === 'object') {
        params = path.pop();
    }

    let url, axOptions;
    if (pageParam === 1) {
        url = path.join('/') + '/';
        axOptions = { params };
    } else {
        url = pageParam;
    }

    const { data } = await ax.get(url, axOptions)
    return data
}

export function usePaginatedQuery({ queryKey, ...args }) {
    return useInfiniteQuery({
        queryKey,
        getNextPageParam: (lastPage, allPages) => lastPage.next,
        getPreviousPageParam: (lastPage, allPages) => lastPage.previous,
        ...args
    });
}

export const genericItemLoader = (queryClient, queryKey) =>
    async ({ params }) => {
        const { itemId } = params;
        if (itemId) {
            return queryClient.ensureQueryData({ queryKey: [queryKey, itemId] });
        } else {
            return
        }
    }

export function useApiMutation({ queryKey, onSuccess, ...options }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (item) => {
            let result;
            if (item.id) {
                result = await ax.patch(queryKey.join('/') + '/' + item.id + '/', item);
            } else {
                result = await ax.post(queryKey.join('/') + '/', item);
            }
            return result.data;
        },
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey });
            if (onSuccess) return onSuccess(...args);
        },
        ...options
    });
}

export function useApiDeleter({ queryKey, onSuccess, ...options }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (itemId) => await ax.delete(queryKey.join('/') + '/' + itemId + '/'),
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey });
            if (onSuccess) return onSuccess(...args);
        },
        ...options
    });
}
