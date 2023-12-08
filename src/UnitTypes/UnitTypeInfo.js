import { useUnitTypes } from "./UnitTypeQueries";


function useUnitTypeInfo() {

    const { isLoading, isError, data, error } = useUnitTypes();

    if (isLoading || isError) {
        return { isLoading, isError, unitTypeInfo: () => null, error };
    }

    const unitTypes = data;

    function unitTypeInfo(unitTypeID) {
        const unitType = unitTypes.find((type) => type.id === unitTypeID);
        if (!unitType) {
            return null;
        }
        return unitType;
    }

    return { isLoading, isError, unitTypeInfo, error };
}


export default useHumanReadableProduct;