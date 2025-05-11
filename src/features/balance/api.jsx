import { useKaasQuery } from "src/services/kaasproducten";


export const useBalance = () => useKaasQuery({ queryKey: ['balance'] });
