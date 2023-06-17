import { Fragment, forwardRef, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';

function PasswordTextField({ id, label, value, onChange, error, title, helperText, inputProps, ...rest }, ref){
    const [show, setShow] = useState(false);

    const handleClickShow = () => setShow((show) => !show);

    const handleMouseDown = (e) => {
        e.preventDefault();
    };

    return (
        <Fragment>
            <TextField
                id={id}
                type={show ? 'text' : 'password'}
                label={label}
                margin="normal"
                fullWidth
                inputProps={inputProps}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShow}
                                onMouseDown={handleMouseDown}
                                edge="end"
                            >
                                {show ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                value={value}
                error={error}
                title={title}
                helperText={helperText}
                onChange={onChange}
                ref={ref}
            />
        </Fragment>
    );
}

export default forwardRef(PasswordTextField);
