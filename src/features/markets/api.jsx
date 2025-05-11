import { useKaasQuery, useModelInstance } from "src/services/kaasproducten";


const location = 'markets';

export const useMarket = (id) => useModelInstance(location, id);
export const useMarkets = () => useKaasQuery({ queryKey: [location] });
