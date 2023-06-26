import FormHelperText from '@mui/material/FormHelperText';
import { Controller } from 'react-hook-form';
import Upload from '~/components/BaseComponent/Upload';
import UploadAvatar from '~/components/BaseComponent/UploadAvatar';

export function BaseUploadAvatarControl({ name, control, ...other }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <UploadAvatar error={!!error} file={field.value} {...other} />
                    {!!error && (
                        <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                            {error.message}
                        </FormHelperText>
                    )}
                </div>
            )}
        />
    );
}

export function BaseUploadControl({
    name,
    control,
    multiple,
    accept = {
        'image/*': [],
    },
    helperText,
    ...other
}) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) =>
                multiple ? (
                    <Upload
                        multiple
                        accept={accept}
                        files={field.value}
                        error={!!error}
                        helperText={
                            (!!error || helperText) && (
                                <FormHelperText error={!!error} sx={{ px: 2 }}>
                                    {error ? error?.message : helperText}
                                </FormHelperText>
                            )
                        }
                        {...other}
                    />
                ) : (
                    <Upload
                        accept={accept}
                        file={field.value}
                        error={!!error}
                        helperText={
                            (!!error || helperText) && (
                                <FormHelperText error={!!error} sx={{ px: 2 }}>
                                    {error ? error?.message : helperText}
                                </FormHelperText>
                            )
                        }
                        {...other}
                    />
                )
            }
        />
    );
}
