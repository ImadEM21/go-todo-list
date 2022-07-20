import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createTheme, StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';
import AuthProvider from './components/contexts/AuthContext';
import TodoProvider from './components/contexts/TodosContext';
import { CircularProgress } from '@mui/material';
const Home = lazy(() => import('./components/home/Home'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));

export interface IAppProps {}

const appTheme: Theme = createTheme({
    palette: {
        primary: {
            main: '#f0f0c0',
            light: '#f0f0c0',
            dark: '#d86030'
        },
        secondary: {
            main: '#f0c090',
            light: '#f0c090',
            dark: '#000018'
        },
        info: {
            main: '#d87848',
            light: '#d87848',
            dark: '#181818'
        },
        text: {
            primary: '#d87848',
            secondary: '#181818',
            disabled: '#f0d8a8'
        }
    }
});

const App: React.FunctionComponent<IAppProps> = () => {
    return (
        <StyledEngineProvider injectFirst={true}>
            <ThemeProvider theme={appTheme}>
                <AuthProvider>
                    <TodoProvider>
                        <Suspense
                            fallback={
                                <div
                                    style={{
                                        width: '100vw',
                                        height: '100vh',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <CircularProgress color="primary" size="5rem" thickness={5} />
                                </div>
                            }
                        >
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                </Routes>
                            </BrowserRouter>
                        </Suspense>
                    </TodoProvider>
                </AuthProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
