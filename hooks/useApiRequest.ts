import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { useSafeResponseSolve } from '@/hooks/useSafeResponseSolve';

export enum LoadingState {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

type ApiReturn<T> = AxiosResponse<{ code: string; message: string; data: T }>;
type ApiFunction<T, R> = (params: T) => Promise<ApiReturn<R>>;
type HookReturnType<R> = {
  errorData: any;
  refetch: () => Promise<void>;
} & (
  | {
      data: R;
      loadingState: LoadingState.SUCCESS;
    }
  | {
      data: undefined;
      loadingState: Exclude<LoadingState, LoadingState.SUCCESS>;
    }
);

/**
 * 用于简化 API 请求中的状态处理
 * @param apiRequest - API 请求函数，应当是 api/generate 中生成的请求函数，需返回 AxiosResponse<{ code, message, data }> 结构
 * @param params - API 请求参数对象，需要使用 useMemo 包裹避免重复请求
 *
 * @returns 返回对象包含：
 * - data: 请求成功时的响应数据（未完成时为 undefined）
 * - loadingState: 请求状态枚举（pending/success/failed）
 * - errorData: 请求失败，经过错误处理后得到的错误数据的错误对象，详见 useSafeResponseSolve
 * - refetch: 手动重新发起请求的函数
 *
 * @example 基础示例
 * // 使用 useMemo 包裹参数对象
 * const params = useMemo(() => ({ userId: 123 }), []);
 * const { data } = useApiRequest(fetchUserInfo, params);
 */
export default function useApiRequest<T, R>(apiRequest: ApiFunction<T, R>, params: T): HookReturnType<R> {
  const [data, setData] = useState<R>();
  const [errorData, setErrorData] = useState<any>();
  const [loadingState, setLoadingState] = useState(LoadingState.PENDING);
  const { handleError } = useSafeResponseSolve(); // HTTP 请求错误处理

  const execute = useCallback(async () => {
    setLoadingState(LoadingState.PENDING);
    try {
      console.log('reqested');
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

  return { data, loadingState, errorData, refetch: execute } as HookReturnType<R>;
}
