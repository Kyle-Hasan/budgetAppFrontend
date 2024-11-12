import React, { useLayoutEffect, useMemo, useRef } from "react"
// @ts-ignore
import _debounce from 'lodash/debounce';
export function useDebounce(callback:Function, delay:number) {
    const callbackRef =useRef(callback);

    
    useLayoutEffect(() => {
      callbackRef.current = callback;
    }, [callback]);
  
    return useMemo(
      () => _debounce((...args: any[]) => callbackRef.current(...args), delay),
      [delay]
    );
  }