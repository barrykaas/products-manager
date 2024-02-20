import { useQueryClient } from "@tanstack/react-query";

import { usePaginatedQuery } from "../Api/Common";


export const scannedItemsQueryKey = "scanneditems";

export function useScannedItems(onlyUnkown = false) {
    const params = {};
    if (onlyUnkown) params.filterknown = onlyUnkown;

    return usePaginatedQuery({ queryKey: [scannedItemsQueryKey, null, params] });
}

export function useScannedItemsInvalidator() {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: [scannedItemsQueryKey] });
}
