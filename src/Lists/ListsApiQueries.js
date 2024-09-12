import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

import ax from "../Api/axios";
import { useInvalidator, usePaginatedQuery } from "../Api/Common";


export const listsQueryKey = 'lists';
export const listItemsQueryKey = 'listitems';
export const receiptListType = 2;
export const transactionListType = 3;
export const settlementListType = 4;


const deleteListFn = async (itemId) => {
    return await ax.delete(`lists/${itemId}/`);
};

const mutateListFn = async (item) => {
    if (item.id) {
        return await ax.patch(`lists/${item.id}/`, item);
    } else {
        return await ax.post('lists/', item);
    }
};

const createMutateListItemFn = async (item) => {
    let data;
    if (item.id) {
        data = await ax.patch(`listitems/${item.id}/`, item);
    } else {
        data = await ax.post('listitems/', item);
    }
    return data?.data;
};

const deleteListItemFn = async (itemId) => {
    await ax.delete(`listitems/${itemId}/`);
};

export function useList(id) {
    return useQuery({
        queryKey: [listsQueryKey, id]
    })
}

export function useLists({ listTypes, params = {} }) {
    const urlParams = params;
    if (listTypes) {
        if (listTypes.length === 1) {
            urlParams.type = listTypes[0]
        } else {
            urlParams.type__in = listTypes.join(',')
        }
    }

    return usePaginatedQuery({
        queryKey: [listsQueryKey, null, urlParams]
    })
}

export function useReceipts({ params } = {}) {
    return useLists({ listTypes: [receiptListType], params });
}

export function useTransactions() {
    return useLists({ listTypes: [transactionListType, settlementListType] });
}

export function useListMutator({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const mutateList = useMutation({
        mutationFn: mutateListFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [listsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return mutateList.mutate;
}

export function useListDeleter({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteListFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [listsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return deleteMutation.mutate;
}

export function useListItems({ listId, eventId, params = {} } = {}) {
    if (listId) params.list = listId;
    if (eventId) params.event = eventId;
    return useQuery({ queryKey: [listItemsQueryKey, null, params] })
}


export function useListItemMutator({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const mutateListItem = useMutation({
        mutationFn: createMutateListItemFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [listItemsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return mutateListItem.mutate;
}


export function useListItemDeleter({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const removeMutation = useMutation({
        mutationFn: deleteListItemFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [listItemsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return removeMutation.mutate;
}

export const useListsInvalidator = () => useInvalidator([listsQueryKey]);
