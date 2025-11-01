import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

import { normalizeEmail } from 'src/common/utils/normalize-email';

const LogInSchema = z.object({
  email: z.email('Invalid email address').transform(normalizeEmail),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9]).*$/,
      'Password must contain at least one uppercase letter and one number',
    ),
});

export class LogInDto extends createZodDto(LogInSchema) {}
