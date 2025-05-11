import { useInstanceDeleter, useInstanceMutation, useKaasInvalidator, useModelInstance, usePaginatedQuery } from "src/services/kaasproducten";

const location = 'events';

export const usePaginatedEvents = (options) => usePaginatedQuery({
    queryKey: [location, options || {}]
});

export const useEventMutation = (options = {}) => {
    const invalidate = useKaasInvalidator();
    return useInstanceMutation(location, {
        ...options,
        onSuccess: (...args) => {
            invalidate([location]);
            if (options.onSuccess) options.onSuccess(...args);
        }
    });
};

export const useEventDeleter = (options = {}) => {
    const invalidate = useKaasInvalidator();
    return useInstanceDeleter(location, {
        ...options,
        onSuccess: (...args) => {
            invalidate([location]);
            if (options.onSuccess) options.onSuccess(...args);
        }
    });
};

export const useEvent = (id) => useModelInstance(location, id);
