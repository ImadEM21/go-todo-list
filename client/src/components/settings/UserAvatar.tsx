import { useState } from 'react';
import { styled } from '@mui/material';
import DropImage from '../ui/DropImage';

const PREFIX = 'UserAvatar';

const classes = {
    helper: `${PREFIX}-helper`
};

const Form = styled('form')(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    marginTop: '2rem',
    marginBottom: '2rem',
    [`&. ${classes.helper}`]: {
        color: theme.palette.text.primary
    }
}));

export interface CustomFile extends File {
    preview: string;
}

export interface IUserAvatarProps {}

const UserAvatar = (props: IUserAvatarProps) => {
    const [files, setFiles] = useState<CustomFile[]>([]);
    return (
        <Form>
            <DropImage files={files} setFiles={setFiles} id="user-avatar" name="user-avatar" placeholder="Glisser et déposer une image ou cliquer pour selectionner une image" />
        </Form>
    );
};

export default UserAvatar;
