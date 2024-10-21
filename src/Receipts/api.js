import { useQueryClient } from "@tanstack/react-query";

import { apiLocations, useApiMutation } from "../Api/Common";


export function useReceiptItemMutation({ receiptId, onSuccess, ...props }) {
    const queryClient = useQueryClient();
    const queryKey = [apiLocations.receipts, receiptId, 'items'];
    return useApiMutation({
        queryKey,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey });
            if (onSuccess) onSuccess(...args);
        },
        ...props
    })
}
