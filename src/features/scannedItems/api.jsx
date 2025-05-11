import { useKaasLocationInvalidator, usePaginatedQuery } from "src/services/kaasproducten";


const location = 'scanned_items';

export const usePaginatedScannedItems = (options) => usePaginatedQuery({
    queryKey: [location, options || {}]
});

export const useScannedItemsInvalidator = () => useKaasLocationInvalidator(location);
