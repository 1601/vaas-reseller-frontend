export const validateName = (name) => {
  const nameRegex = /^[a-zA-Z-' ]+$/;
  return nameRegex.test(name);
};

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

export const validateMobileNumber = (country, number, countryCodes, mobileNumberLengths) => {
  if (!number) {
    return '';
  }

  const numericRegex = /^[0-9]+$/;
  if (!numericRegex.test(number)) {
    return 'Invalid characters in the number';
  }

  const expectedLength = mobileNumberLengths[country];
  const actualLength = number.length;

  if (!expectedLength) {
    return 'Unsupported country';
  }
  if (actualLength < expectedLength) {
    return 'Number is too short';
  }
  if (actualLength > expectedLength) {
    return 'Number is too long';
  }

  return '';
};
