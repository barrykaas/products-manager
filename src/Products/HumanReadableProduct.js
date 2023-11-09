import { useQuery } from "@tanstack/react-query";
import { getUnitTypesFn } from "./ProductsApiQueries";

function useHumanReadableProduct() {

    const { isLoading, isError, data, error } = useQuery(["unittypes"], getUnitTypesFn);

    if (isLoading || isError) {
        return { isLoading, isError, formatProductDescription: () => '', error };
    }

    const unitTypes = data?.data || [];

    function formatProductDescription(product) {
        const unitType = unitTypes.find((type) => type.id === product.unit_type);
        if (!unitType) {
            return 'Invalid unit type';
        }

        if (unitType.type.includes('Per stuk, met volume')) {
            return `${product.unit_number} stuk${product.unit_number > 1 ? 's' : ''}`;
        }

        if (unitType.type.includes('Per gewicht')) {
            return `${product.unit_weightvol} g`;
        }

        if (unitType.type.includes('Per stuk, zonder gewicht')) {
            return `${product.unit_number} stuk${product.unit_number > 1 ? 's' : ''}`;
        }

        if (unitType.type.includes('Per stuk, met een vaste lengte')) {
            return `${product.unit_number} stuk${product.unit_number > 1 ? 's' : ''} van ${product.unit_weightvol} m`;
        }

        if (unitType.type.includes('Per verpakking, met gewicht')) {
            return `${product.unit_number} stuk${product.unit_number > 1 ? 's' : ''} van ${product.unit_weightvol} g`;
        }    
    }
    

    return { isLoading, isError, formatProductDescription, error };
}


export default useHumanReadableProduct;