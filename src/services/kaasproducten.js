import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { kaasproducten } from "src/lib/kaasproducten";


async function queryFn({ queryKey, pageParam = 1 }) {
    const path = queryKey.slice(1);
    let params;

    if (typeof path[path.length - 1] === 'object') {
        params = path.pop();
    }

    let url, axOptions;
    if (pageParam === 1) {
        url = path.join('/') + '/';
        axOptions = { params };
    } else {
        url = pageParam;
    }

    const { data } = await kaasproducten.get(url, axOptions)
    return data
}

async function mutate(location, item) {
    let result;
    if (item.id) {
        result = await kaasproducten.patch(location + '/' + item.id + '/', item);
    } else {
        result = await kaasproducten.post(location + '/', item);
    }
    return result.data;
}

async function deleteInstance(location, id) {
    const result = await kaasproducten.delete(location + '/' + id + '/');
    return result.data;
}

const kaasQueryKey = (queryKey) => ['kp', ...queryKey];

export function usePaginatedQuery({ queryKey, ...args }) {
    return useInfiniteQuery({
        queryFn,
        queryKey: kaasQueryKey(queryKey),
        getNextPageParam: (lastPage) => lastPage.next,
        getPreviousPageParam: (lastPage) => lastPage.previous,
        ...args
    });
}

export function useKaasQuery({ queryKey, ...args }) {
    return useQuery({
        queryFn,
        queryKey: kaasQueryKey(queryKey),
        ...args
    })
}

export const useModelInstance = (location, id) => useKaasQuery({
    queryKey: [location, Number(id)],
    enabled: !!id
});

export const useInstanceMutation = (location, options = {}) => useMutation({
    mutationFn: async (instance) => await mutate(location, instance),
    ...options
});

export const useInstanceDeleter = (location, options = {}) => useMutation({
    mutationFn: async (id) => await deleteInstance(location, id),
    ...options
});

export const useKaasInvalidator = () => {
    const queryClient = useQueryClient();
    return (...queryKeys) => queryKeys.map(kaasQueryKey).map(queryKey =>
        queryClient.invalidateQueries({ queryKey })
    );
};

export const useKaasLocationInvalidator = (location) => {
    const kaasInvalidate = useKaasInvalidator();
    return () => kaasInvalidate([location]);
}

export const useGenericInstanceMutation = (location, options = {}, invalidateLocations = []) => {
    const invalidate = useKaasInvalidator();
    return useInstanceMutation(location, {
        ...options,
        onSuccess: (...args) => {
            invalidate([location], ...invalidateLocations);
            if (options.onSuccess) options.onSuccess(...args);
        }
    });
};

export const useGenericInstanceDeleter = (location, options = {}, invalidateLocations = []) => {
    const invalidate = useKaasInvalidator();
    return useInstanceDeleter(location, {
        ...options,
        onSuccess: (...args) => {
            invalidate([location], ...invalidateLocations);
            if (options.onSuccess) options.onSuccess(...args);
        }
    });
};

export const getInstance = async (location, id) => {
    const { data } = await kaasproducten.get(location + '/' + id + '/');
    return data;
};
