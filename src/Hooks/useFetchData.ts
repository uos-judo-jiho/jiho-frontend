import React, { useState, useEffect, useCallback } from "react";

function useFetchData(getApi: any, params?: any) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [response, setResponse] = useState<any>();

  const sendQuery = useCallback(async () => {
    try {
      await setLoading(true);
      await setError(false);
      var res = "";
      if (params) {
        res = await getApi(params);
      } else {
        res = await getApi();
      }

      setResponse(res);
      setLoading(false);
    } catch (err) {
      setError(err as boolean);
    }
  }, [params]);

  useEffect(() => {
    sendQuery();
  }, [params, sendQuery, getApi]);
  return { loading, error, response };
}

export default useFetchData;
