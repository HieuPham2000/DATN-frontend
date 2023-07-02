import { memo } from 'react';
import { Box, FormHelperText, IconButton, Tooltip, alpha } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import ReactQuill, { Quill } from 'react-quill';
import styled from '@emotion/styled';
import { Highlight } from '@mui/icons-material';
import 'react-quill/dist/quill.snow.css';

let Inline = Quill.import('blots/inline');
class MarkBlot extends Inline {}
MarkBlot.blotName = 'mark';
MarkBlot.tagName = 'mark';
Quill.register(MarkBlot, true);

const modules = {
    toolbar: {
        container: '#toolbar',
    },
    clipboard: {
        matchVisual: false,
    },
};

const formats = ['mark'];

const StyledEditor = styled(Box)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${alpha(theme.palette.text.primary, 0.23)}`,
    boxSizing: 'border-box',
    padding: '1px',

    '&:hover': {
        borderColor: theme.palette.text.primary,
    },

    '&:focus-within': {
        padding: 0,
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
    },

    '&.hasError': {
        borderColor: theme.palette.error.main,
        color: theme.palette.error.main,

        '& .ql-editor': {
            '&.ql-blank::before': {
                color: theme.palette.error.main,
            },
        },
    },

    '& .ql-container.ql-snow': {
        border: 'none',
        ...theme.typography.body2,
        fontFamily: theme.typography.fontFamily,
    },
    '& .ql-toolbar.ql-snow': {
        border: 'none',
        fontFamily: theme.typography.fontFamily,
    },
    '& .ql-toolbar.ql-snow button': {
        width: '34px',
        height: '34px',
        border: 'unset',
        float: 'unset',
        display: 'block',
        color: alpha(theme.palette.primary.light, 0.7),

        '&:hover, &:focus, &.ql-active, &.ql-selected': {
            color: theme.palette.primary.main,
        },
    },
    '& .ql-editor': {
        minHeight: 160,
        maxHeight: 640,
        // backgroundColor: alpha(theme.palette.grey[500], 0.08),

        '&.ql-blank::before': {
            fontStyle: 'normal',
            color: theme.palette.text.disabled,
        },
        '& pre.ql-syntax': {
            ...theme.typography.body2,
            padding: theme.spacing(2),
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.grey[900],
        },
    },
}));

function ExampleRTEControl({ style }) {
    const {
        control,
        formState: { errors },
    } = useFormContext();
    return (
        <>
            <StyledEditor className={!!errors?.example ? 'hasError' : ''} style={style}>
                <Box id="toolbar" sx={{ position: 'absolute', bottom: 0, right: 0, zIndex: 20 }}>
                    <Tooltip title="Highlight">
                        <IconButton className="ql-mark">
                            <Highlight />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Controller
                    name="example"
                    control={control}
                    render={({ field: { ref, ...field } }) => (
                        <ReactQuill
                            ref={ref}
                            {...field}
                            modules={modules}
                            formats={formats}
                            placeholder="Example (*)"
                        />
                    )}
                />
            </StyledEditor>
            {!!errors?.example && (
                <FormHelperText error sx={{ px: 2 }}>
                    {errors.example.message}
                </FormHelperText>
            )}
        </>
    );
}

export default memo(ExampleRTEControl);
