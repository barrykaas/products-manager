import { useInstanceDeleter, useInstanceMutation, useKaasInvalidator, usePaginatedQuery } from "../../services/kaasproducten";

const location = 'transactions';

export const usePaginatedTransactions = (options) => usePaginatedQuery({
    queryKey: [location, options || {}]
});

export const useTransactionMutation = (options = {}) => {
    const invalidate = useKaasInvalidator();
    return useInstanceMutation(location, {
        ...options,
        onSuccess: (...args) => {
            invalidate([location]);
            if (options.onSuccess) options.onSuccess(...args);
        }
    });
};

export const useTransactionDeleter = (options = {}) => {
    const invalidate = useKaasInvalidator();
    return useInstanceDeleter(location, {
        ...options,
        onSuccess: (...args) => {
            invalidate([location]);
            if (options.onSuccess) options.onSuccess(...args);
        }
    });
};
