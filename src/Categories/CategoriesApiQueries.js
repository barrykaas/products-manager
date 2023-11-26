import { useInfiniteQuery } from "@tanstack/react-query";

import apiPath from "../Api/ApiPath";


const queryKey = 'categories';

export const fetchCategories = async ({ pageParam = 1, parentId }) => {
    let res
    const parentFilter = parentId ? `parent_id=${parentId}` : 'parent_id__isnull=true';
    if(pageParam === 1) {
        res = await fetch(`${apiPath}/categories/?page=1&${parentFilter}`)
    } else {
        res = await fetch(pageParam)
    }
    return res.json()
}

export function useCategories(parentId) {
    return useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: ({ pageParam = 1 }) => fetchCategories({ pageParam, parentId: parentId }),
        getNextPageParam: (lastPage, allPages) => lastPage.next,
    });
}
