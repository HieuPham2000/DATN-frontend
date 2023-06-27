import React, { memo, useState } from 'react';
import { Box, Step, StepLabel, Stepper } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './ImportDialogContent.module.scss';
import ImportStepOne from '~/components/Dictionary/ImportDialog/ImportStepOne';
import ImportStepTwo from '~/components/Dictionary/ImportDialog/ImportStepTwo';
import ImportStepThree from '~/components/Dictionary/ImportDialog/ImportStepThree';

const cx = classNames.bind(styles);
const steps = ['Select import file', 'Check import data', 'View import result'];
function ImportDialogContent({ dictId, dictName, onClose }) {
    const [activeStep, setActiveStep] = useState(0);
    const [importData, setImportData] = useState({
        ImportSession: null,
        ListValidateError: null,
        NumberError: 0,
        NumberValid: 0,
        StrFileError: null,
    });
    const [numberSuccessRecord, setNumberSuccessRecord] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleFinish = () => {
        onClose();
    };

    return (
        <Box className={cx('wrapper')}>
            <div className={cx('header')}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
                        return (
                            <Step key={label}>
                                <StepLabel></StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </div>
            <div className={cx('main')}>
                {activeStep === 0 && (
                    <ImportStepOne onNext={handleNext} dictId={dictId} setImportData={setImportData} />
                )}
                {activeStep === 1 && (
                    <ImportStepTwo
                        onNext={handleNext}
                        onBack={handleBack}
                        dictId={dictId}
                        dictName={dictName}
                        importData={importData}
                        setNumberSuccessRecord={setNumberSuccessRecord}
                    />
                )}
                {activeStep === 2 && (
                    <ImportStepThree onFinish={handleFinish} numberSuccessRecord={numberSuccessRecord} />
                )}
            </div>
        </Box>
    );
}

export default memo(ImportDialogContent);
