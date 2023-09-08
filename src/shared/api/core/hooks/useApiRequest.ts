import { useState, useEffect } from 'react';
import type { ApiRequest } from '@commercetools/platform-sdk/dist/declarations/src/generated/shared/utils/requests-utils';

interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const useApiRequest = <T>(request: ApiRequest<T> | null): RequestState<T> => {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (request) {
      setState({
        data: null,
        loading: true,
        error: null,
      });

      request
        .execute()
        .then((response) => {
          setState({
            data: response.body,
            loading: false,
            error: null,
          });
        })
        .catch((err: unknown) => {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err : new Error('Failed to get data'),
          });
        });
    }
  }, [request]);

  return state;
};

export { useApiRequest, type RequestState };
