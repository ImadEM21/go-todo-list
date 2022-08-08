import { forwardRef } from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

export interface IAlertProps {}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props: IAlertProps, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default Alert;
