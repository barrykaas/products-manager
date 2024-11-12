import { apiLocations } from "../Api/Common";
import { useModelInstance } from "../Common/api";


export const useBrand = (id) => useModelInstance(apiLocations.brands, id);
