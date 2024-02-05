import { useInfiniteQuery } from "@tanstack/react-query";

import ax from "../Api/axios";


const queryKey = 'categories';

const fetchCategories = async ({ pageParam = 1, parentId }) => {
    let res
    const parentFilter = parentId ? `parent_id=${parentId}` : 'parent_id__isnull=true';
    if(pageParam === 1) {
        res = await ax.get(`categories/?page=1&${parentFilter}`);
    } else {
        res = await ax.get(pageParam);
    }
    return res.data;
}

export function useCategories(parentId) {
    return useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: ({ pageParam = 1 }) => fetchCategories({ pageParam, parentId: parentId }),
        getNextPageParam: (lastPage, allPages) => lastPage.next,
    });
}
