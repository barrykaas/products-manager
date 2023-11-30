import { useInfiniteQuery } from "@tanstack/react-query";

import apiPath from "../Api/ApiPath";


const listsQueryKey = 'lists';
const receiptListType = 2;

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
