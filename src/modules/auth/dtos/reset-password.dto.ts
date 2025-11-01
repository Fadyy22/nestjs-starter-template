import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

const ResetPasswordSchema = z.object({
  resetToken: z.string(),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9]).*$/,
      'Password must contain at least one uppercase letter and one number',
    ),
});

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}
