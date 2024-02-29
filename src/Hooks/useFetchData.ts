import { useCallback, useEffect, useState } from "react";

const useFetchData = (apiMethod: any, params?: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [response, setResponse] = useState<any>();

  const sendQuery = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      let res = "";
      if (params) {
        res = await apiMethod(params);
      } else {
        res = await apiMethod();
      }

      setResponse(res);
      setLoading(false);
    } catch (err) {
      setError(!!err);
    }
  }, [apiMethod, params]);

  useEffect(() => {
    sendQuery();
  }, [params, sendQuery, apiMethod]);
  return { loading, error, response };
};

export default useFetchData;
