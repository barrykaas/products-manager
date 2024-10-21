import { useQuery } from "@tanstack/react-query";

import { apiLocations } from "./Common";


export function useReceiptItems(receiptId) {
    const query = useQuery({
        queryKey: [apiLocations.receipts, receiptId, 'items']
    });

    return query;
}
