import * as React from 'react';
import { Button, Theme, useTheme } from '@mui/material';

const regularStyle = (theme: Theme) => ({
    width: '100%',
    paddingTop: '.5rem',
    paddingBottom: '.5rem',
    marginBottom: '.25rem',
    paddingLeft: '1rem',
    borderRadius: '25px 0 0 25px',
    justifyContent: 'left',
    color: theme.palette.text.secondary,
    '&:hover': {
        boxShadow: '0px 3px 2px 0px rgba(0, 0, 0, 0.24) inset',
        cursor: 'pointer',
        backgroundColor: theme.palette.text.secondary,
        color: theme.palette.secondary.main
    }
});

const activeStyle = (theme: Theme) => ({
    boxShadow: '0px 3px 2px 0px rgba(0, 0, 0, 0.24) inset',
    backgroundColor: theme.palette.text.secondary,
    color: theme.palette.secondary.main,
    width: '100%',
    paddingTop: '.5rem',
    paddingBottom: '.5rem',
    marginBottom: '.25rem',
    paddingLeft: '1rem',
    borderRadius: '25px 0 0 25px',
    justifyContent: 'left',
    position: 'relative',
    '&:hover': {
        boxShadow: '0px 3px 2px 0px rgba(0, 0, 0, 0.24) inset',
        cursor: 'pointer',
        backgroundColor: theme.palette.text.secondary,
        color: theme.palette.secondary.main
    }
});

export interface ISidebarButtonProps {
    children: React.ReactNode;
    startIcon: React.ReactNode;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    active: boolean;
}

const SidebarButton = ({ children, startIcon, onClick, active }: ISidebarButtonProps) => {
    const theme: Theme = useTheme();
    return (
        <Button onClick={onClick} startIcon={startIcon} sx={active ? activeStyle(theme) : regularStyle(theme)}>
            {children}
        </Button>
    );
};

export default SidebarButton;
