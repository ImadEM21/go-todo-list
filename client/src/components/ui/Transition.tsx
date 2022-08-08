import { forwardRef } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { Slide } from '@mui/material';

export interface ITransitionProps extends TransitionProps {
    children: React.ReactElement<any, any>;
}

const Transition = forwardRef(function Transition(props: ITransitionProps, ref: React.Ref<unknown>) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default Transition;
