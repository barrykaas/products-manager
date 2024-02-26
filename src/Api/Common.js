import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import ax from "./axios";


export function useInvalidator(queryKey) {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: [queryKey] });
}

export const defaultQueryFn = async ({ queryKey, pageParam = 1 }) => {
    const [route, itemId, params] = queryKey;

    let url, axOptions;
    if (pageParam === 1) {
        url = route + '/' + (itemId ? itemId + '/' : '');
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
