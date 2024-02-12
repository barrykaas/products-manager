import { useQuery, useInfiniteQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import ax from "../Api/axios";
import { useInvalidator } from "../Api/Common";
import { listItemsQueryKey } from "../Lists/ListsApiQueries";


const eventsQueryKey = 'events';

const deleteEventFn = async (itemId) => {
    return await ax.delete(`events/${itemId}/`);
};

const mutateEventFn = async (data) => {
    if (data.id) {
        return await ax.patch(`events/${data.id}/`, data);
    } else {
        return await ax.post('events/', data);
    }
};

const fetchEvents = async ({ pageParam = 1 }) => {
    let res;
    if (pageParam === 1) {
        res = await ax.get('events/');
    } else {
        res = await ax.get(pageParam);
    }
    return res.data;
}

const getEventFn = async (id) => {
    return await ax.get(`events/${id}/`);
};

export function useEvent(id) {
    const { isError, error, isLoading, data } = useQuery({
        queryKey: [eventsQueryKey, id],
        queryFn: async ({ queryKey }) => await getEventFn(queryKey[1])
    });
    const actualData = data?.data;
    return { isError, error, isLoading, data: actualData };
}

export function useEvents() {
    return useInfiniteQuery({
        queryKey: [eventsQueryKey],
        queryFn: fetchEvents,
        getNextPageParam: (lastPage, allPages) => lastPage.next,
    });
}

export function useEventMutator({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const mutateEvent = useMutation({
        mutationFn: mutateEventFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [eventsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return mutateEvent.mutate;
}

export function useEventDeleter({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteEventFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [eventsQueryKey] });
            queryClient.invalidateQueries({ queryKey: [listItemsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return deleteMutation.mutate;
}

export const useEventsInvalidator = () => useInvalidator(eventsQueryKey);
