import { useCallback, useRef } from "react";

/**
 * A small registry for grouping multiple DOM nodes under one logical
 * animation target, when a single ref object can't do it because the nodes
 * live in different components (e.g. the nav CTA and the intro block both
 * belong to the Hero's "early fade" group). Returns a stable callback-ref
 * factory — the same function instance is reused across renders for a
 * given key, so React doesn't detach/reattach on every render — plus a
 * getter for the current live list.
 */
export function useRefGroup<T extends Element>() {
  const nodes = useRef<Map<string, T>>(new Map());
  const callbacks = useRef<Map<string, (node: T | null) => void>>(new Map());

  const register = useCallback((key: string) => {
    const existing = callbacks.current.get(key);
    if (existing) return existing;

    const callback = (node: T | null) => {
      if (node) {
        nodes.current.set(key, node);
      } else {
        nodes.current.delete(key);
      }
    };
    callbacks.current.set(key, callback);
    return callback;
  }, []);

  const getAll = useCallback(() => Array.from(nodes.current.values()), []);

  return { register, getAll };
}