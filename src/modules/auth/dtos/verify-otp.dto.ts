import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

import { normalizeEmail } from 'src/common/utils/normalize-email';

const VerifyOtpSchema = z.object({
  email: z.email('Invalid email address').transform(normalizeEmail),
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
});

export class VerifyOtpDto extends createZodDto(VerifyOtpSchema) {}
