import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

import { normalizeEmail } from 'src/common/utils/normalize-email';

const SignUpSchema = z.object({
  email: z.email('Invalid email address').transform(normalizeEmail),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9]).*$/,
      'Password must contain at least one uppercase letter and one number',
    ),
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .transform((value) => value.trim()),
  username: z
    .string()
    .min(1, 'Username is required')
    .transform((value) => value.trim()),
});

export class SignUpDto extends createZodDto(SignUpSchema) {}
