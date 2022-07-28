import { useEffect } from 'react';
import usePrevious from './usePrevious';

const useEffectDebugger = (effectHook: Function, dependencies: Array<any>, dependencyNames: Array<string>) => {
    const previousDeps = usePrevious(dependencies, []);

    const changedDeps = dependencies.reduce((accum, dependency, index) => {
        if (dependency !== previousDeps[index]) {
            const keyName = dependencyNames[index] || index;
            return {
                ...accum,
                [keyName]: {
                    before: previousDeps[index],
                    after: dependency
                }
            };
        }

        return accum;
    }, {});

    useEffect(() => effectHook(changedDeps), dependencies);
};

export default useEffectDebugger;
