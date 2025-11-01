import { normalizeEmail as normalizeEmailValidator } from 'validator';

export const normalizeEmail = (email: string) => {
  return (
    normalizeEmailValidator(email, {
      all_lowercase: true,
      gmail_remove_dots: true,
      gmail_remove_subaddress: true,
      gmail_convert_googlemaildotcom: false,
    }) || email
  );
};
