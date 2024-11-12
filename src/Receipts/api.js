import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "../Api/Common";
import { useModelInstance } from "../Common/api";


export const receiptsQueryKey = 'receipts';
export const receiptItemsQueryKey = 'receipt_items';

export function useReceiptItemMutation({ receiptId, onSuccess, ...props }) {
    const queryClient = useQueryClient();
    const queryKey = [receiptsQueryKey, receiptId, 'items'];
    return useApiMutation({
        queryKey,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey });
            if (onSuccess) onSuccess(...args);
        },
        ...props
    })
}

export const useReceipt = (id) => useModelInstance(receiptsQueryKey, id);
