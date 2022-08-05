import { useState } from 'react';
import { Button } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ResetPassword from './ResetPassword';

export interface IResetPasswordButtonProps {}

const ResetPasswordButton = (props: IResetPasswordButtonProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button color="info" variant="text" onClick={() => setOpen(true)} endIcon={<ArrowRightAltIcon color="info" />}>
                Mot de passe oublié ?
            </Button>
            {open && <ResetPassword open={open} setOpen={setOpen} />}
        </>
    );
};

export default ResetPasswordButton;
