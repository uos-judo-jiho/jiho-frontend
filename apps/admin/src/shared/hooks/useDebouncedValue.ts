import { useEffect, useState } from "react";

/**
 * 값이 `delay` 동안 더 바뀌지 않을 때만 갱신되는 사본을 돌려준다.
 *
 * 검색어를 그대로 쿼리 키로 쓰면 타이핑 한 글자마다 요청이 나가므로,
 * 네트워크로 나가는 값에만 이 훅을 씌운다 (입력창 자체는 즉시 반응해야 한다).
 */
export const useDebouncedValue = <T>(value: T, delay = 250): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebouncedValue;
