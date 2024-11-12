import { useQuery } from "@tanstack/react-query";


export function useModelInstance(location, id) {
    return useQuery({
        queryKey: [location, id],
        enabled: !!id
    });
}
