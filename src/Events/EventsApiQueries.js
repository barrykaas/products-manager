import axios from "axios";

import apiPath from "../Api/ApiPath";

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
