import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortctrll = new AbortController();
      activeHttpRequests.current.push(httpAbortctrll);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortctrll.signal,
        });
        const responseData = await response.json();
        // console.log(activeHttpRequests.current);
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortctrll
        );
        // console.log(activeHttpRequests.current);
        setIsLoading(false);
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        return responseData;
      } catch (error) {
        setIsLoading(false);
        if (error.name !== "AbortError") {
          setError(error.message || "Something Went Wrong!");
          throw error;
        }
      } finally {
        setIsLoading(false);
      }
    },

    []
  );

  const clearError = () => {
    setError(null);
  };
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);
  return { isLoading, error, sendRequest, clearError };
};
