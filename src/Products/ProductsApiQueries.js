import axios from "axios";

export const getPersonsFn = async () => {
    return axios.get(`https://django.producten.kaas/api/persons/`)
};

export const getUnitTypesFn = async () => {
    return axios.get(`https://django.producten.kaas/api/unittypes/`);
};

export const createProductFn = async (data) => {
    return axios.post(`https://django.producten.kaas/api/products/`, data)
};

export const fetchProducts = async ({ pageParam = 0 }) => {
    let res
    if(pageParam === 0) {
        res = await fetch('https://django.producten.kaas/api/products/?page=1')
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
        res = await fetch(`https://django.producten.kaas/api/products/?page=1&search=${searchQuery}`)
    } else {
        res = await fetch(pageParam)
    }
    return res.json()
}