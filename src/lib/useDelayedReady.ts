import { useEffect, useState } from "react";

/** Simulates network latency for realistic skeletons. */
export function useDelayedReady(ms = 450, deps: unknown[] = []) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ready;
}
