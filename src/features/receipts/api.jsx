import { getInstance, useGenericInstanceDeleter, useGenericInstanceMutation, useKaasQuery, useModelInstance, usePaginatedQuery } from "src/services/kaasproducten";


const location = 'receipts';

export const usePaginatedReceipts = (options) => usePaginatedQuery({
    queryKey: [location, options || {}]
});

export const useReceiptMutation = (options) => useGenericInstanceMutation(location, options);
export const useReceiptDeleter = (options) => useGenericInstanceDeleter(location, options);
export const getReceipt = async (id) => await getInstance(location, id);
export const useReceipt = (id) => useModelInstance(location, id);
export const useReceiptItems = (id) => useKaasQuery({ queryKey: [location, Number(id), 'items'] });

export const useReceiptItemMutation = (receiptId, options) => useGenericInstanceMutation(
    location + '/' + receiptId + '/items', 
    options,
    [[location, Number(receiptId), 'items']]
);
export const useReceiptItemDeleter = (receiptId, options) => useGenericInstanceDeleter(
    location + '/' + receiptId + '/items', 
    options,
    [[location, Number(receiptId), 'items']]
);

export const usePaginatedReceiptItems = (options) => usePaginatedQuery({
    queryKey: ['receipt_items', options || {}]
});
