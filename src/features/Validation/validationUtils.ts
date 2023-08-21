import { Rule } from 'antd/es/form';
import { postcodeValidator } from 'postcode-validator';
import dayjs, { Dayjs } from 'dayjs';

const validateWhitespace = (value: string) => {
  if (!value) {
    return Promise.reject('Please fill in the field!');
  }

  if (value.startsWith(' ')) {
    return Promise.reject("Please don't use spaces at the beginning");
  }

  if (value.endsWith(' ')) {
    return Promise.reject("Please don't use spaces at the end");
  }

  return Promise.resolve();
};

export const validateEmail = (_: Rule, value: string) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (value) {
    if (!emailRegex.test(value)) {
      if (!value.includes('@')) {
        return Promise.reject("Email address must contain an '@' symbol.");
      } else if (value.split('@')[1].trim() === '') {
        return Promise.reject('Email address must contain a domain name.');
      } else if (value.trim() === '') {
        return Promise.reject('Email address must not contain leading or trailing whitespace.');
      } else {
        return Promise.reject('Email address must be properly formatted');
      }
    } else {
      return Promise.resolve();
    }
  }
  return Promise.resolve();
};

export const validateField = (_: Rule, value: string) => {
  return validateWhitespace(value).then(() => {
    //const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>0-9]/.test(value);
    const hasSpecialCharacters = /[!@#$%'^&*(),.?":{}|<>0-9\\-]|[!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/.test(value);
    if (value && !hasSpecialCharacters) {
      return Promise.resolve();
    }
    return Promise.reject('Must contain at least one character and no special characters or numbers');
  });
};

export const validateData = (_: Rule, value: Dayjs) => {
  if (!value) return Promise.reject('Please fill in the field!');
  const currentDate = dayjs();
  const birthDate = dayjs(value);
  const age = currentDate.diff(birthDate, 'year');
  if (age >= 13) {
    return Promise.resolve();
  }
  return Promise.reject('You must be over 13');
};

export const validatePostalCode = (country: string, value: string) => {
  // const postalCodeRegex = country === 'RU' ? /^\d{6}$/ : /^\d{5}$/;
  let error = '';
  if (country === 'US') {
    error = 'code should be (5 digits): XXXXX or (5-4 digits): XXXXX-XXXX';
  } else if (country === 'RU') {
    error = 'code should be (6 digits): XXXXXX';
  } else if (country === 'FR' || country === 'DE') {
    error = 'code should be (5 digits): XXXXX';
  }
  // const error = country === 'RU' ? 'code (6 digits): XXXXXX' : 'code (5 digits): XXXXX';
  if (postcodeValidator(value, country)) {
    return Promise.resolve();
  }
  // if (postalCodeRegex.test(value)) {
  //   return Promise.resolve();
  // }
  return Promise.reject(error);
};

export const validateStreet = (_: Rule, value: string) => {
  return validateWhitespace(value).then(() => {
    if (value.length > 0) {
      return Promise.resolve();
    }
    return Promise.reject('Please fill in the field!');
  });
};

export const validatePassword = (_: Rule, value: string) => {
  const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]).{8,}$/;
  if (value) {
    if (value.length < 8) {
      return Promise.reject('Password must be at least 8 characters long');
    } else if (!/[a-z]/.test(value)) {
      return Promise.reject('Password must contain at least one lowercase letter (A-Z).');
    } else if (!/[A-Z]/.test(value)) {
      return Promise.reject('Password must contain at least one uppercase letter (A-Z).');
    } else if (!/\d/.test(value)) {
      return Promise.reject('Password must contain at least one digit (0-9).');
    } else if (!/[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/.test(value)) {
      return Promise.reject('Password must contain at least one special character (e.g., !@#$%^&*).');
    } else if (!/^\S(?:.*\S)?$/g.test(value)) {
      return Promise.reject('Password must not contain leading or trailing whitespace.');
    } else if (passRegex.test(value)) {
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }
  return Promise.resolve();
};
