import { useState, useEffect } from "react";

export function useLocalStoragy(key: string, defaultValue: null | any) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const rawValue = JSON.stringify(value);
    localStorage.setItem(key, rawValue);
  }, [key, value]);

  return [value, setValue];
}