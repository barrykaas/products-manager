import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import ax from "../Api/axios";


const eventsQueryKey = 'events';

export const createEventFn = async (data) => {
    return await ax.post('events/', data)
};

export const fetchEvents = async ({ pageParam = 1 }) => {
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
