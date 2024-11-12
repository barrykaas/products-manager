import { apiLocations } from "../Api/Common";
import { useModelInstance } from "../Common/api";


export const useMarket = (marketId) => useModelInstance(apiLocations.markets, marketId);
