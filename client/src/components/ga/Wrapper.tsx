import { useEffect, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

export interface IWrapperProps {
    initialized: boolean;
    children: PropsWithChildren<any>;
}

const Wrapper = ({ initialized, children }: IWrapperProps) => {
    const location = useLocation();

    useEffect(() => {
        if (initialized) {
            ReactGA.pageview(location.pathname + location.search);
        }
    }, [initialized, location]);

    return children;
};

export default Wrapper;
