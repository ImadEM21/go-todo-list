import { IRoute } from './Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import SidebarButton from './SidebarButton';
import { AuthContext } from '../../contexts/AuthContext';
import { UserContextType } from '../../../@types/user';
import { useContext } from 'react';

export interface IRenderRouteProps {
    route: IRoute;
}

const RenderRoute = ({ route }: IRenderRouteProps) => {
    const { logout } = useContext(AuthContext) as UserContextType;
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 900px)');
    const isActive = pathname === route.path || (route.slash && pathname.includes(route.path + '/'));

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (route.isLogout) {
            logout();
        }
        navigate(route.path);
    };

    return (
        <SidebarButton onClick={handleClick} startIcon={<route.Icon />} active={isActive}>
            {isMobile ? '' : route.label}
        </SidebarButton>
    );
};

export default RenderRoute;
