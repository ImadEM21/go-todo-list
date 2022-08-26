import CookieConsent from 'react-cookie-consent';
import { Button } from '@mui/material';
import useAnalytics from '../../hooks/useAnalytics';

export interface ICookiesHandlerProps {}

const CookiesHandler = (props: ICookiesHandlerProps) => {
    const { handleAcceptCookie, handleDeclineCookie } = useAnalytics();

    return (
        <CookieConsent
            enableDeclineButton={true}
            onAccept={handleAcceptCookie}
            onDecline={handleDeclineCookie}
            declineButtonText="Refuser"
            buttonClasses="accept-rcc-btn"
            declineButtonClasses="refuse-rcc-btn"
            location="bottom"
            buttonText="Accepter"
            debug={false}
            style={{
                background: 'white',
                color: 'black',
                fontSize: '12px'
            }}
            buttonStyle={{ borderRadius: '10px' }}
            expires={150}
            ButtonComponent={Button}
        >
            Nous utilisons des cookies sur notre site Web pour vous offrir l'expérience la plus pertinente en mémorisant vos préférences et vos visites répétées. En cliquant sur "Accepter", vous
            consentez à l'utilisation de TOUS les cookies.
        </CookieConsent>
    );
};

export default CookiesHandler;
