import { TransformationType } from 'class-transformer';
import { TransformFnParams } from 'class-transformer/types/interfaces';

export const dateTransformer = ({ value, type }: TransformFnParams): unknown => {
  if (!value) {
    return;
  }

  if (type === TransformationType.CLASS_TO_PLAIN) {
    return value.getTime();
  } else {
    return new Date(value);
  }
};

export const generateCustomerCode = (prefix) => {
  const randomNumber = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  const customerCode = prefix + randomNumber;
  return customerCode;
};
