import { useQueryClient } from "@tanstack/react-query";


export function useInvalidator(queryKey) {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: [queryKey] });
}

