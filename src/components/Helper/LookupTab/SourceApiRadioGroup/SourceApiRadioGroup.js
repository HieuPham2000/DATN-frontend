import { memo } from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import HUSTConstant from '~/utils/common/constant';

function SourceApiRadioGroup({ value, setValue }) {
    return (
        <>
            <FormControl
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <FormLabel id="source-api-radio-btn-group" sx={{ mr: 2 }}>
                    Source API
                </FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="source-api-radio-btn-group"
                    name="radio-btn-group"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                >
                    <FormControlLabel
                        value={HUSTConstant.SourceApiDictionary.FreeDictionaryApi}
                        control={<Radio />}
                        label="Free Dictionary API"
                    />
                    <FormControlLabel
                        value={HUSTConstant.SourceApiDictionary.WordsApi}
                        control={<Radio />}
                        label="Words API"
                    />
                    <FormControlLabel
                        value={HUSTConstant.SourceApiDictionary.WordNet}
                        control={<Radio />}
                        label="WordNet (upcoming)"
                        disabled
                    />
                </RadioGroup>
            </FormControl>
        </>
    );
}

export default memo(SourceApiRadioGroup);
