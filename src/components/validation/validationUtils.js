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
