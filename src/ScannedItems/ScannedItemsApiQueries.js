import axios from "axios";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import apiPath from "../Api/ApiPath";

export const scannedItemsQueryKey = "scanneditems";

export const fetchScannedItems = async ({ pageParam = 1, onlyUnkown = false }) => {
    let res
    if (pageParam === 1) {
        res = await fetch(`${apiPath}/scanneditems/?page=1&filterknown=${onlyUnkown}`)
    } else {
        res = await fetch(pageParam)
    }
    return res.json()
}

export const getBarcodeProduct = async (barcode) => {
    return axios.get(`${apiPath}/products/?barcode=${barcode}`)
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
