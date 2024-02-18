import { useInfiniteQuery, useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

import ax from "../Api/axios";
import { useInvalidator } from "../Api/Common";


const listsQueryKey = 'lists';
export const listItemsQueryKey = 'listitems';
export const receiptListType = 2;
export const transactionListType = 3;
export const settlementListType = 4;


const fetchLists = async ({ pageParam = 1, listTypes, params = {} }) => {
    let res;
    const urlParams = params;
    if (listTypes) {
        if (listTypes.length === 1) {
            urlParams.type = listTypes[0]
        } else {
            urlParams.type__in = listTypes.join(',')
        }
    }

    if (pageParam === 1) {
        res = await ax.get('lists/', { params: urlParams });
    } else {
        res = await ax.get(pageParam);
    }
    return res.data;
}

const getListFn = async (id) => {
    const res = await ax.get(`lists/${id}`);
    return res.data;
};

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

const getListItemsFn = async ({ listId, eventId }) => {
    const urlParams = {
        list: listId,
        event: eventId,
    };
    return await ax.get('listitems/', { params: urlParams })
}

const createMutateListItemFn = async (item) => {
    if (item.id) {
        await ax.patch(`listitems/${item.id}/`, item);
    } else {
        await ax.post('listitems/', item);
    }
};

const deleteListItemFn = async (itemId) => {
    await ax.delete(`listitems/${itemId}/`);
};

export function useList(id) {
    return useQuery({
        queryKey: [listsQueryKey, id],
        queryFn: async () => await getListFn(id)
    })
}

export function useLists({ listTypes, params = {} }) {
    return useInfiniteQuery({
        queryKey: [listsQueryKey, listTypes],
        queryFn: ({ pageParam = 1 }) => fetchLists({ pageParam, listTypes, params }),
        getNextPageParam: (lastPage, allPages) => lastPage.next,
    });
}

export function useReceipts() {
    return useLists({ listTypes: [receiptListType] });
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

export function useListItems({ listId, eventId } = {}) {
    const { isError, error, isLoading, data } = useQuery({
        queryKey: [listItemsQueryKey, listId, eventId],
        queryFn: async () => await getListItemsFn({ listId, eventId })
    });

    const actualData = data?.data || [];
    return { isError, error, isLoading, data: actualData };
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

export const useListsInvalidator = () => useInvalidator(listsQueryKey);
