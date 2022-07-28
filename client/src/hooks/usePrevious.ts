import { useEffect, useRef } from 'react';

const usePrevious = (value: Array<unknown>, initialValue: Array<unknown>) => {
    const ref = useRef(initialValue);

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
};

export default usePrevious;
