import { useEffect, useRef } from "react";

export const useObjectURLPool = () => {
  const pool = useRef<string[]>([]);
  useEffect(() => {
    return () => {
      pool.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);
  return pool;
};
