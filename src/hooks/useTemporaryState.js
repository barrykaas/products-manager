import { useState, useCallback, useRef, useEffect } from 'react';


export const useTemporaryState = (initial, timeout = 2000) => {
    const [state, _setState] = useState(initial);
    const timeoutRef = useRef();
    const initialValueRef = useRef(initial);

    useEffect(() => {
        initialValueRef.current = initial
    }, [initial]);

    const setState = useCallback(
        async valueOrUpdater => {
            _setState(valueOrUpdater);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(
                () => _setState(initialValueRef.current),
                timeout
            );
        },
        [timeout]
    );

    return [state, setState];
}
