import { NUMBERS_REGEX, WHITESPACE_REGEX } from '../constants/main';

export const findPrice = (value: string): string => {
  const price = value.replace(WHITESPACE_REGEX, '').match(NUMBERS_REGEX);

  return price.at(0);
};
