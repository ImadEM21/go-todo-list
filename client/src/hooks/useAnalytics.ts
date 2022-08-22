import { useEffect, useState } from 'react';
import ReactGA from 'react-ga';

const useAnalytics = () => {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (import.meta.env.PROD) {
            ReactGA.initialize(import.meta.env.VITE_GA_ID);
        }
        setInitialized(true);
    }, []);

    return {
        initialized
    };
};

export default useAnalytics;
