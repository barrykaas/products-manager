import { useInfiniteQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

import apiPath from "../Api/ApiPath";


const listsQueryKey = 'lists';
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


const mutateListFn = async (item) => {
    if (item.id) {
        return await axios.patch(`${apiPath}/lists/${item.id}/`, item);
    } else {
        return await axios.post(`${apiPath}/lists/`, item);
    }
};

const deleteListFn = async (itemId) => {
    return await axios.delete(`${apiPath}/lists/${itemId}/`);
};


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
