import { useCallback, useEffect, useState } from 'react';

interface UseMockQueryOptions<TData> {
  queryFn: () => Promise<TData>;
  enabled?: boolean;
}

export function useMockQuery<TData>({ queryFn, enabled = true }: UseMockQueryOptions<TData>) {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const runQuery = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await queryFn();
      setData(response);
    } catch (queryError) {
      const message = queryError instanceof Error ? queryError.message : 'Something went wrong.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn]);

  useEffect(() => {
    if (enabled) {
      void runQuery();
    }
  }, [enabled, runQuery]);

  return {
    data,
    isLoading,
    error,
    refetch: runQuery,
  };
}
