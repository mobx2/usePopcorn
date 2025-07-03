import { useEffect, useState } from "react";

export function useLocalStorage(key, initailValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);

    return stored ? JSON.parse(stored) : initailValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return { value, setValue };
}
