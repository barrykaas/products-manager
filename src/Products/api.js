import { apiLocations } from "../Api/Common";
import { useModelInstance } from "../Common/api";


export const useProduct = (id) => useModelInstance(apiLocations.products, id);
