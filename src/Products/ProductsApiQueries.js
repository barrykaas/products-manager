import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiPath from "../Api/ApiPath";
import { scannedItemsQueryKey } from "../ScannedItems/ScannedItemsApiQueries";

export const productsQueryKey = "products";

export const getPersonsFn = async () => {
    return axios.get(`${apiPath}/persons/`)
};

export const getUnitTypesFn = async () => {
    return axios.get(`${apiPath}/unittypes/`);
};

export const createProductFn = async (data) => {
    return axios.post(`${apiPath}/products/`, data)
};

const mutateProductFn = async (item) => {
    if (item.id) {
        return await axios.patch(`${apiPath}/products/${item.id}/`, item);
    } else {
        return await axios.post(`${apiPath}/products/`, item);
    }
};

const deleteProductFn = async (itemId) => {
    return await axios.delete(`${apiPath}/products/${itemId}/`);
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

export function useProductMutator({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const mutateProduct = useMutation({
        mutationFn: mutateProductFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [productsQueryKey] });
            queryClient.invalidateQueries({ queryKey: [scannedItemsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return mutateProduct.mutate;
}

export function useProductDeleter({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteProductFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [productsQueryKey] });
            queryClient.invalidateQueries({ queryKey: [scannedItemsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return deleteMutation.mutate;
}
