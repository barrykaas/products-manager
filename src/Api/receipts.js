import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { apiLocations } from "./Common";


export function useReceiptItems(receiptId) {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: [apiLocations.receipts, receiptId, 'items']
    });

    useEffect(() => {
        if (query.isSuccess) {
            query.data.forEach(receiptItem => {
                if (receiptItem.product) {
                    queryClient.setQueryData(
                        [apiLocations.products, receiptItem.product.id],
                        receiptItem.product
                    )
                }
            });
        }
    }, [query.isSuccess]);

    return query;
}
