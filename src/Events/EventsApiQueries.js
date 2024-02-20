import { useQueryClient, useMutation } from "@tanstack/react-query";

import ax from "../Api/axios";
import { useInvalidator, usePaginatedQuery } from "../Api/Common";
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

export function useEvents() {
    return usePaginatedQuery({
        queryKey: [eventsQueryKey]
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
