import axios from "axios";
import apiPath from "../Api/ApiPath";

export const getPersonsFn = async () => {
    return axios.get(`${apiPath}/persons/`)
};

export const getUnitTypesFn = async () => {
    return axios.get(`${apiPath}/unittypes/`);
};

export const createProductFn = async (data) => {
    return axios.post(`${apiPath}/products/`, data)
};

export const fetchProducts = async ({ pageParam = 0 }) => {
    let res
    if(pageParam === 0) {
        res = await fetch(`${apiPath}/products/?page=1`)
    } else {
        res = await fetch(pageParam)
    }
    return res.json()
}

export const fetchProductsAndSearchFn = async (pageParam = 0, searchQuery) => {
    console.log("searchQuery", searchQuery, pageParam);

    if (searchQuery === "" || searchQuery === undefined) {
        return fetchProducts({ pageParam });
    }

    let res
    if(pageParam === 0) {
        res = await fetch(`${apiPath}/products/?page=1&search=${searchQuery}`)
    } else {
        res = await fetch(pageParam)
    }
    return res.json()
}