import { validate } from 'deep-email-validator';

const isEmailValid = async (email: string) => {
  return validate(email);
};

const validatePhoneNumber = (input_str: string) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(input_str);
};

export const validateId = async (id: string) => {
  let id_type = '';
  const { valid } = await isEmailValid(id);

  if (valid) {
    id_type = 'email';
  }

  if (validatePhoneNumber(id)) {
    id_type = 'phone';
  }

  return id_type;
};
