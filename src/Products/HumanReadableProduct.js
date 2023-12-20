import { formatProductQuantity } from "../Helpers/productQuantity";
import { useUnitTypes } from "../UnitTypes/UnitTypeQueries";


export default function useHumanReadableProduct() {

    const { isLoading, isError, data, error } = useUnitTypes();

    if (isLoading || isError) {
        return { isLoading, isError, formatProductDescription: () => '', error };
    }

    const unitTypes = data || [];

    function formatProductDescription(product) {
        const unitType = unitTypes.find((type) => type.id === product.unit_type);
        if (!unitType) {
            return 'Invalid unit type';
        }
        return formatProductQuantity({
            unit: unitType.physical_unit,
            volume: product.unit_weightvol,
            pieces: product.unit_number
        });
    }
    

    return { isLoading, isError, formatProductDescription, error };
}
