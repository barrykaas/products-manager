import { useInfiniteQuery, useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

import apiPath from "../Api/ApiPath";


const listsQueryKey = 'lists';
const listItemsQueryKey = 'listitems';
export const receiptListType = 2;


const fetchLists = async ({ pageParam = 1, listType }) => {
    let res
    const listTypeParam = listType ? `&type=${listType}` : '';

    if (pageParam === 1) {
        res = await fetch(`${apiPath}/lists/?page=1${listTypeParam}`)
    } else {
        res = await fetch(pageParam)
    }
    return res.json()
}

const deleteListFn = async (itemId) => {
    return await axios.delete(`${apiPath}/lists/${itemId}/`);
};

const mutateListFn = async (item) => {
    if (item.id) {
        return await axios.patch(`${apiPath}/lists/${item.id}/`, item);
    } else {
        return await axios.post(`${apiPath}/lists/`, item);
    }
};

const getListItemsFn = async ({ listId, eventId }) => {
    const urlParams = {
        list: listId,
        event: eventId,
    };
    return await axios.get(`${apiPath}/listitems/`, { params: urlParams })
}

const createMutateListItemFn = async (item) => {
    if (item.id) {
        await axios.patch(`${apiPath}/listitems/${item.id}/`, item);
    } else {
        await axios.post(`${apiPath}/listitems/`, item);
    }
};

const deleteListItemFn = async (itemId) => {
    await axios.delete(`${apiPath}/listitems/${itemId}/`);
};


export function useLists(listType) {
    return useInfiniteQuery({
        queryKey: [listsQueryKey],
        queryFn: ({ pageParam = 1 }) => fetchLists({ pageParam, listType }),
        getNextPageParam: (lastPage, allPages) => lastPage.next,
    });
}

export function useReceipts() {
    return useLists(receiptListType)
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
