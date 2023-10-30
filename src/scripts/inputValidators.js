const validator = require("email-validator");

// Email validator
const validateEmail = (value) => {
  return validator.validate(value);
};

// Password validator
const validatePassword = (password) => {

  const requiredLength = 6;

  const hasRequiredLength = password.length >= requiredLength ? true : false;
  const hasUpperCase = password.toLowerCase() !== password;
  const hasLowerCase = password.toUpperCase() !== password;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(password);

  // Calculate true values from all checks that are placed inside array
  const securityLevel = [hasRequiredLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(value => value).length;

  const result = {
    hasRequiredLength: { status: hasRequiredLength, message: hasRequiredLength ? "OK" : "Password is too short" },
    hasUpperCase: { status: hasUpperCase, message: hasUpperCase ? "OK" : "Password is missing at least one Capital letter" },
    hasLowerCase: { status: hasLowerCase, message: hasLowerCase ? "OK" : "Password is missing at least one lower case letter" },
    hasNumber: { status: hasNumber, message: hasNumber ? "OK" : "Password is missing at least one number" },
    hasSpecialChar: { status: hasSpecialChar, message: hasSpecialChar ? "OK" : "Password is missing at least one special character" },
    securityLevel: hasRequiredLength ? securityLevel : 1
  };

  return result;
};

export { validateEmail, validatePassword };