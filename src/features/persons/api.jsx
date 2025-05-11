import { useKaasQuery, useModelInstance } from "../../services/kaasproducten";


export const usePerson = (id) => useModelInstance('persons', id);
export const usePersons = () => useKaasQuery({ queryKey: ['persons'] });
