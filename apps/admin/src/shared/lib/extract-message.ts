/** axios 에러 응답의 message 를 안전하게 꺼내고, 없으면 fallback 을 반환한다. */
export const extractMessage = (error: unknown, fallback: string): string => {
  const data = (error as { response?: { data?: { message?: string } } })
    ?.response?.data;
  return data?.message ?? fallback;
};
