import axios from "axios";
import apiPath from "../Api/ApiPath";

export const createShoppingListFn = async (data) => {
    return axios.post(`${apiPath}/lists/`, data)
};

export const getShoppingListFn = async (id) => {
    return axios.get(`${apiPath}/lists/${id}/`)
};

export const getBrandsFn = async () => {
    return axios.get(`${apiPath}/brands/`)
};



// export const editShoppingListFn = async (data) => {
//     axios.post('https://django.producten.kaas/api/lists/', data)
// };