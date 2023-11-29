import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import apiPath from "../Api/ApiPath";


const listItemsQueryKey = 'shoppinglistitems';

export const createShoppingListFn = async (data) => {
    return axios.post(`${apiPath}/lists/`, data)
};

export const getShoppingListFn = async (id) => {
    return axios.get(`${apiPath}/lists/${id}/`)
};

export const getBrandsFn = async () => {
    return axios.get(`${apiPath}/brands/`)
};

const mutateListItemFn = async (updatedItem) => await axios.patch(`${apiPath}/listitems/${updatedItem.id}/`, updatedItem);

const deleteListItemFn = async (itemId) => await axios.delete(`${apiPath}/listitems/${itemId}/`);


export function useListItemMutator({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const mutateListItem = useMutation({
        mutationFn: mutateListItemFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [listItemsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return mutateListItem.mutate;
}


export function useListItemDeleter({ onSuccess, onError } = {}) {
    const queryClient = useQueryClient();

    const removeMutation = useMutation({
        mutationFn: deleteListItemFn,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: [listItemsQueryKey] });
            if (onSuccess) onSuccess(...args);
        },
        onError: onError
    });

    return removeMutation.mutate;
}


// export const editShoppingListFn = async (data) => {
//     axios.post('https://django.producten.kaas/api/lists/', data)
// };