import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchDemoProperty, analyzeProperty } from "@/lib/api";
import type { Property } from "@shared/domain";

/**
 * Fetches the demo property from the API.
 * Only fires when `enabled` is true (i.e., user clicked Demo or searched).
 */
export function useDemoProperty(enabled: boolean) {
  return useQuery<Property>({
    queryKey: ["properties", "demo"],
    queryFn: fetchDemoProperty,
    enabled,
  });
}

/**
 * Mutation hook for analyzing a property by address.
 */
export function useAnalyzeProperty() {
  return useMutation<Property, Error, string>({
    mutationFn: analyzeProperty,
  });
}
