import axios from "axios";

import apiPath from "../Api/ApiPath";
import { useQuery } from "@tanstack/react-query";


const eventsQueryKey = 'events';

export const createEventFn = async (data) => {
    return axios.post(`${apiPath}/events/`, data)
};

export const fetchEvents = async ({ pageParam = 0 }) => {
    let res
    if(pageParam === 0) {
        res = await fetch(`${apiPath}/events/?page=1`)
    } else {
        res = await fetch(pageParam)
    }
    return res.json()
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
    return {isError, error, isLoading, data: actualData};
}
