import { useGenericInstanceDeleter, useGenericInstanceMutation, useKaasQuery, useModelInstance } from "src/services/kaasproducten";


const location = 'brands';

export const useBrand = (id) => useModelInstance(location, id);
export const useBrands = () => useKaasQuery({ queryKey: [location] });
export const useBrandMutation = (options) => useGenericInstanceMutation(location, options);
export const useBrandDeleter = (options) => useGenericInstanceDeleter(location, options);
