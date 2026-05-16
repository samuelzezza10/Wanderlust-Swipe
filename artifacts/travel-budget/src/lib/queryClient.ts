import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, _error) => {
        if (!navigator.onLine) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      networkMode: "offlineFirst",
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
    mutations: {
      networkMode: "always",
    },
  },
});
