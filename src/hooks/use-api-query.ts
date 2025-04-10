import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface ApiError {
  message: string;
  status: number;
}

export function useApiQuery<TData>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<TData, ApiError, TData>, 'queryKey' | 'queryFn'>
) {
  const { toast } = useToast();

  return useQuery<TData, ApiError>({
    queryKey: key,
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
      }
      return response.json();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
    ...options,
  });
}

export function useApiMutation<TData, TVariables>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'>
) {
  const { toast } = useToast();

  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
      }

      return response.json();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
    ...options,
  });
}
