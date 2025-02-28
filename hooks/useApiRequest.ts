import { useSafeResponseSolve } from '@/hooks/useSafeResponseSolve';
import { LoadingState } from '@/types/loading-state';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';

type ApiReturn<T> = AxiosResponse<{ code: string; message: string; data: T }>;
type ApiFunction<T, R> = (params: T) => Promise<ApiReturn<R>>;

export default function useApiRequest<T, R>(apiRequest: ApiFunction<T, R>, params: T) {
  const [data, setData] = useState<R>();
  const [errorData, setErrorData] = useState<any>();
  const [loadingState, setLoadingState] = useState(LoadingState.UNINIT);
  const { handleError } = useSafeResponseSolve(); // HTTP 请求错误处理

  const execute = useCallback(async () => {
    setLoadingState(LoadingState.PENDING);
    try {
      const result = await apiRequest(params);
      setData(result.data.data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err: any) {
      handleError(err);
      setErrorData(err);
      setLoadingState(LoadingState.FAILED);
    }
  }, [apiRequest, handleError, params]);

  useEffect(() => {
    execute();
  }, [execute]);

  // data loadingState errorData refetch
  return [data, loadingState, errorData, execute];
}
