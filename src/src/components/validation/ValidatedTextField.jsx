import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

const ValidatedTextField = ({ validationFunction, reset, ...props }) => {
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  useEffect(() => {
    console.log(`reset prop for ${props.label}:`, reset);
    setError(false);
    setHelperText('');
  }, [reset, props.label]);

  const handleChange = (event) => {
    const isValid = validationFunction(event.target.value);
    setError(!isValid);
    setHelperText(isValid ? '' : `Invalid ${props.label}`);

    if (props.onChange) {
      props.onChange(event);
    }
  };

  return <TextField {...props} error={error} helperText={helperText} onChange={handleChange} />;
};

export default ValidatedTextField;
