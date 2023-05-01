import { Fragment, useEffect, useRef, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { validateWithRules } from '~/utils/common/validate/validate';

function PasswordTextField({ id, label, value, onChange, validateRules, ...rest }) {
    const [show, setShow] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const needValidate = useRef(false);

    const handleClickShow = () => setShow((show) => !show);

    const handleMouseDown = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        if (needValidate.current && validateRules) {
            let [, msg] = validateWithRules(validateRules, value, { label });
            setErrorMsg(msg);
        }
        needValidate.current = true;
    }, [value, label, validateRules]);

    return (
        <Fragment>
            <TextField
                id={id}
                type={show ? 'text' : 'password'}
                label={label}
                margin="normal"
                fullWidth
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
                error={!!errorMsg}
                title={errorMsg}
                helperText={errorMsg}
                onChange={onChange}
            />
        </Fragment>
    );
}

export default PasswordTextField;
