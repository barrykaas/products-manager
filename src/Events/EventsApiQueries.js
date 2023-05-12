import axios from "axios";

export const getPersonsFn = async () => {
    return axios.get(`https://django.producten.kaas/api/persons/`)
};

export const createEventFn = async () => {
    return axios.get(`https://django.producten.kaas/api/persons/`)
};

export const fetchEvents = async ({ pageParam = 0 }) => {
    let res
    if(pageParam === 0) {
        res = await fetch('https://django.producten.kaas/api/events/?page=1')
    } else {
        res = await fetch(pageParam)
    }
    return res.json()
  }