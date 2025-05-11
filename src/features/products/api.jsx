import { useGenericInstanceDeleter, useGenericInstanceMutation, useKaasQuery, useModelInstance, usePaginatedQuery } from "src/services/kaasproducten";


const location = 'products';

export const usePaginatedProducts = (options) => usePaginatedQuery({
    queryKey: [location, options || {}]
});

export const useProductMutation = (options) => useGenericInstanceMutation(location, options, ['scanned_items']);
export const useProductDeleter = (options) => useGenericInstanceDeleter(location, options);
export const useProduct = (id) => useModelInstance(location, id);

export const useUnitType = (id) => useModelInstance('unit_types', id);
export const useUnitTypes = () => useKaasQuery({ queryKey: ['unit_types'] });
