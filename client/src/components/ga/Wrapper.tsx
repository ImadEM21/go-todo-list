import { useEffect, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import useAnalytics from '../../hooks/useAnalytics';
import CookiesHandler from './CookiesHandler';

export interface IWrapperProps {
    children: PropsWithChildren<any>;
}

const Wrapper = ({ children }: IWrapperProps) => {
    const location = useLocation();
    const { isConsent } = useAnalytics();

    useEffect(() => {
        if (isConsent === 'true') {
            ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
        }
    }, [location, isConsent]);

    return (
        <>
            {children}
            <CookiesHandler />
        </>
    );
};

export default Wrapper;
