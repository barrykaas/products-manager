import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import ax from "../Api/axios";


export const scannedItemsQueryKey = "scanneditems";

const fetchScannedItems = async ({ pageParam = 1, onlyUnkown = false }) => {
    let res
    if (pageParam === 1) {
        res = await ax.get('scanneditems/', { params: { filterknown: onlyUnkown } });
    } else {
        res = await ax.get(pageParam);
    }
    return res.data;
};


export function useScannedItems(onlyUnkown = false) {
    return useInfiniteQuery({
        queryKey: [scannedItemsQueryKey],
        queryFn: ({ pageParam = 1 }) => fetchScannedItems({ pageParam, onlyUnkown }),
        getNextPageParam: (lastPage, allPages) => lastPage.next,
    });
}

export function useScannedItemsInvalidator() {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: [scannedItemsQueryKey] });
}
