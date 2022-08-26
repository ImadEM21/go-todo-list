import { useEffect, useState } from 'react';
import { Cookies, getCookieConsentValue } from 'react-cookie-consent';
import { initGA } from '../utils/ga-utils';

const useAnalytics = () => {
    const [isConsent] = useState(getCookieConsentValue());

    const handleAcceptCookie = () => {
        let id: string | undefined = import.meta.env.VITE_GA_ID;
        if (id) {
            initGA(id);
        }
    };

    useEffect(() => {
        console.log('effect consent', isConsent);
    }, [isConsent]);

    const handleDeclineCookie = () => {
        // remove google analytics cookies
        Cookies.remove('_ga');
        Cookies.remove('_gat');
        Cookies.remove('_gid');
    };

    useEffect(() => {
        if (isConsent === 'true') {
            handleAcceptCookie();
        }
    }, [isConsent]);

    return {
        isConsent,
        handleAcceptCookie,
        handleDeclineCookie
    };
};

export default useAnalytics;
