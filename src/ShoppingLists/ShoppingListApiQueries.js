import axios from "axios";

export const createShoppingListFn = async (data) => {
    return axios.post('https://django.producten.kaas/api/lists/', data)
};

export const getShoppingListFn = async (id) => {
    return axios.get(`https://django.producten.kaas/api/lists/${id}/`)
};

export const getBrandsFn = async () => {
    return axios.get(`https://django.producten.kaas/api/brands/`)
};



// export const editShoppingListFn = async (data) => {
//     axios.post('https://django.producten.kaas/api/lists/', data)
// };