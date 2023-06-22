import FormHelperText from '@mui/material/FormHelperText';
import { Controller } from 'react-hook-form';
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

// export function BaseUploadBox({ name, ...other }) {
//   const { control } = useFormContext();

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState: { error } }) => (
//         <UploadBox files={field.value} error={!!error} {...other} />
//       )}
//     />
//   );
// }

// export function BaseUpload({ name, multiple, helperText, ...other }) {
//   const { control } = useFormContext();

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState: { error } }) =>
//         multiple ? (
//           <Upload
//             multiple
//             accept={{ 'image/*': [] }}
//             files={field.value}
//             error={!!error}
//             helperText={
//               (!!error || helperText) && (
//                 <FormHelperText error={!!error} sx={{ px: 2 }}>
//                   {error ? error?.message : helperText}
//                 </FormHelperText>
//               )
//             }
//             {...other}
//           />
//         ) : (
//           <Upload
//             accept={{ 'image/*': [] }}
//             file={field.value}
//             error={!!error}
//             helperText={
//               (!!error || helperText) && (
//                 <FormHelperText error={!!error} sx={{ px: 2 }}>
//                   {error ? error?.message : helperText}
//                 </FormHelperText>
//               )
//             }
//             {...other}
//           />
//         )
//       }
//     />
//   );
// }
