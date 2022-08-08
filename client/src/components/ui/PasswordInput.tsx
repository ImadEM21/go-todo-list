import { useState } from 'react';
import { FormControl, InputLabel, FilledInput, InputAdornment, IconButton, useTheme, FormHelperText } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFormContext, RegisterOptions } from 'react-hook-form';

export interface IPasswordInputProps {
    label: string;
    color: 'error' | 'info' | 'primary' | 'secondary' | 'success' | 'warning' | undefined;
    id: string;
    error: boolean;
    errorMessage: string | undefined;
    defaultValue: string;
    fullWidth: boolean;
    name: string;
    options?: RegisterOptions;
}

const PasswordInput = ({ label, color, id, error, errorMessage, defaultValue, fullWidth, name, options }: IPasswordInputProps) => {
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useFormContext();

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <FormControl fullWidth={fullWidth} variant="filled" color={color} required>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <FilledInput
                id={id}
                type={showPassword ? 'text' : 'password'}
                {...register(name, options)}
                defaultValue={defaultValue}
                aria-describedby={`${id}-helper-text`}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton aria-label="afficher le mot de passe" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
            {error && (
                <FormHelperText sx={{ color: theme.palette.text.primary }} id={`${id}-helper-text`}>
                    {errorMessage}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default PasswordInput;
