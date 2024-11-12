import { apiLocations, useApiMutation } from "../Api/Common";
import { useModelInstance } from "../Common/api";


export const useProduct = (id) => useModelInstance(apiLocations.products, id);
export const useProductMutation = () => useApiMutation({ queryKey: [apiLocations.products] });
