import axios from "axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import apiPath from "../Api/ApiPath";


const eventsQueryKey = 'events';

export const createEventFn = async (data) => {
    return axios.post(`${apiPath}/events/`, data)
};

export const fetchEvents = async ({ pageParam = 1 }) => {
    let res;
    if (pageParam === 1) {
        res = await axios.get(`${apiPath}/events/`);
    } else {
        console.log("EVENTS else");
        res = await axios.get(pageParam);
    }
    return res.data;
}

const getEventFn = async (id) => {
    return await axios.get(`${apiPath}/events/${id}`);
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
