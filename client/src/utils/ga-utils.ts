import ReactGA from 'react-ga4';

export const initGA = (id: string) => {
    if (import.meta.env.PROD) {
        ReactGA.initialize(id);
    }
};
