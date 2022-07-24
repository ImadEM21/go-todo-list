import { ReactNode } from 'react';
import { styled, Grid, SvgIconTypeMap } from '@mui/material';
import Sidebar from './sidebar/Sidebar';
import UserInfo from './UserInfo';
import { OverridableComponent } from '@mui/material/OverridableComponent';

const Root = styled(Grid)(({ theme }) => ({
    minHeight: '100vh',
    height: '100vh',
    backgroundColor: theme.palette.primary.main,
    overflowY: 'scroll'
}));

const RightSection = styled(Grid)({
    width: '100%',
    display: 'flex',
    flexFlow: 'column',
    height: '100%'
});

const Content = styled(Grid)({
    padding: '1rem',
    paddingTop: '1.5rem',
    flex: '1 1 auto',
    overflowY: 'scroll'
});

export interface IDashWrapperProps {
    children: ReactNode;
    title: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
        muiName: string;
    };
}

const DashWrapper = ({ children, title, Icon }: IDashWrapperProps) => {
    return (
        <Root container={true}>
            <Grid item={true} xs={1.5} md={2}>
                <Sidebar />
            </Grid>
            <RightSection item={true} xs={10.5} md={10}>
                <UserInfo title={title} Icon={Icon} />
                <Content display="flex" flexDirection="column" gap="1rem">
                    {children}
                </Content>
            </RightSection>
        </Root>
    );
};

export default DashWrapper;
